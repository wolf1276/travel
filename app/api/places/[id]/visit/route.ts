import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { serializePlaceDetail } from '@/lib/serializers/place';
import { markAsVisitedSchema } from '@/lib/validations/place.schema';
import { PLACE_INCLUDE } from '@/lib/db/placeInclude';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const place = await prisma.place.findFirst({ where: { id, coupleId: user.coupleId } });
  if (!place) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const json = await request.json();
  const parsed = markAsVisitedSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid visit data', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { visitDate, rating, journal, photos, favoritePhotoIndex } = parsed.data;

  const updated = await prisma.$transaction(async (tx) => {
    const visit = await tx.visit.create({
      data: {
        placeId: id,
        userId: user.id,
        visitDate: new Date(visitDate),
        rating,
        journal,
      },
    });

    if (photos.length > 0) {
      await tx.photo.createMany({
        data: photos.map((photo, index) => ({
          visitId: visit.id,
          userId: user.id,
          url: photo.url,
          storagePath: photo.path,
          width: photo.width ?? null,
          height: photo.height ?? null,
          caption: photo.caption ?? null,
          position: index,
          isFavorite: index === favoritePhotoIndex,
        })),
      });
    }

    await tx.place.update({ where: { id }, data: { status: 'VISITED' } });

    return tx.place.findUniqueOrThrow({ where: { id }, include: PLACE_INCLUDE });
  });

  return NextResponse.json({ place: serializePlaceDetail(updated) });
}
