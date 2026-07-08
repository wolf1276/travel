import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PLACE_INCLUDE } from '@/lib/db/placeInclude';
import { syncPlaceTags } from '@/lib/db/syncPlaceTags';
import { serializePlaceListItem } from '@/lib/serializers/place';
import { placeSchema } from '@/lib/validations/place.schema';

export async function GET(request: NextRequest) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const statusParam = searchParams.get('status');
  const status = statusParam === 'WANT_TO_VISIT' || statusParam === 'VISITED' ? statusParam : undefined;
  const cursor = searchParams.get('cursor');
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Number(limitParam) : undefined;

  const places = await prisma.place.findMany({
    where: { userId: user.id, ...(status ? { status } : {}) },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    include: PLACE_INCLUDE,
    ...(limit ? { take: limit + 1 } : {}),
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = limit ? places.length > limit : false;
  const page = hasMore ? places.slice(0, limit) : places;
  const nextCursor = hasMore ? (page[page.length - 1]?.id ?? null) : null;

  return NextResponse.json({ places: page.map(serializePlaceListItem), nextCursor });
}

export async function POST(request: NextRequest) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const json = await request.json();
  const parsed = placeSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid place data', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { tags, ...data } = parsed.data;

  const place = await prisma.$transaction(async (tx) => {
    const created = await tx.place.create({
      data: { ...data, userId: user.id },
    });
    await syncPlaceTags(tx, user.id, created.id, tags);
    return tx.place.findUniqueOrThrow({ where: { id: created.id }, include: PLACE_INCLUDE });
  });

  return NextResponse.json({ place: serializePlaceListItem(place) }, { status: 201 });
}
