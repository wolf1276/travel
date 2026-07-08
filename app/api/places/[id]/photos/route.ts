import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { serializePlaceDetail } from '@/lib/serializers/place';
import { addPhotosSchema } from '@/lib/validations/place.schema';
import { PLACE_INCLUDE } from '@/lib/db/placeInclude';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const place = await prisma.place.findFirst({
    where: { id, coupleId: user.coupleId },
    include: { visits: { orderBy: { visitDate: 'desc' }, take: 1, include: { photos: true } } },
  });
  if (!place) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const visit = place.visits[0];
  if (!visit) return NextResponse.json({ error: 'Place has not been visited yet' }, { status: 422 });

  const json = await request.json();
  const parsed = addPhotosSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid photo data', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const startPosition = visit.photos.length;
  const hasFavorite = visit.photos.some((photo) => photo.isFavorite);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.photo.createMany({
      data: parsed.data.photos.map((photo, index) => ({
        visitId: visit.id,
        userId: user.id,
        url: photo.url,
        storagePath: photo.path,
        width: photo.width ?? null,
        height: photo.height ?? null,
        caption: photo.caption ?? null,
        position: startPosition + index,
        isFavorite: !hasFavorite && index === 0,
      })),
    });

    return tx.place.findUniqueOrThrow({ where: { id }, include: PLACE_INCLUDE });
  });

  return NextResponse.json({ place: serializePlaceDetail(updated) });
}
