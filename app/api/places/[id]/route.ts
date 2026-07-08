import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { syncPlaceTags } from '@/lib/db/syncPlaceTags';
import { serializePlaceDetail } from '@/lib/serializers/place';
import { updatePlaceSchema } from '@/lib/validations/place.schema';
import { createAdminClient } from '@/services/supabase/admin';
import { PLACE_INCLUDE } from '@/lib/db/placeInclude';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const place = await prisma.place.findFirst({
    where: { id, userId: user.id },
    include: PLACE_INCLUDE,
  });
  if (!place) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ place: serializePlaceDetail(place) });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.place.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const json = await request.json();
  const parsed = updatePlaceSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid place data', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { tags, ...data } = parsed.data;

  const place = await prisma.$transaction(async (tx) => {
    await tx.place.update({ where: { id }, data });
    if (tags) await syncPlaceTags(tx, user.id, id, tags);
    return tx.place.findUniqueOrThrow({ where: { id }, include: PLACE_INCLUDE });
  });

  return NextResponse.json({ place: serializePlaceDetail(place) });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const place = await prisma.place.findFirst({
    where: { id, userId: user.id },
    include: { visits: { include: { photos: true } } },
  });
  if (!place) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const storagePaths = place.visits.flatMap((visit) => visit.photos.map((photo) => photo.storagePath));
  if (place.coverImagePath) storagePaths.push(place.coverImagePath);

  await prisma.place.delete({ where: { id } });

  if (storagePaths.length > 0) {
    try {
      const admin = createAdminClient();
      await admin.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? 'photos')
        .remove(storagePaths);
    } catch (error) {
      console.error('Failed to clean up storage objects for deleted place', id, error);
    }
  }

  return NextResponse.json({ success: true });
}
