import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PLACE_INCLUDE } from '@/lib/db/placeInclude';
import { serializePlaceListItem } from '@/lib/serializers/place';

export async function GET(request: NextRequest) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q')?.trim();
  const statusParam = searchParams.get('status');
  const status = statusParam === 'WANT_TO_VISIT' || statusParam === 'VISITED' ? statusParam : undefined;
  const tag = searchParams.get('tag')?.trim();

  const places = await prisma.place.findMany({
    where: {
      userId: user.id,
      ...(status ? { status } : {}),
      ...(tag ? { tags: { some: { tag: { name: tag } } } } : {}),
      ...(q
        ? {
            OR: [
              { city: { contains: q, mode: 'insensitive' } },
              { country: { contains: q, mode: 'insensitive' } },
              { tags: { some: { tag: { name: { contains: q, mode: 'insensitive' } } } } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: PLACE_INCLUDE,
  });

  return NextResponse.json({ places: places.map(serializePlaceListItem) });
}
