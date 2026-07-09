import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [visitedPlaces, dreamPlacesRemaining, photosUploaded, tripsCompleted] = await Promise.all([
    prisma.place.findMany({
      where: { coupleId: user.coupleId, status: 'VISITED' },
      select: { country: true },
    }),
    prisma.place.count({ where: { coupleId: user.coupleId, status: 'WANT_TO_VISIT' } }),
    prisma.photo.count({ where: { userId: user.id } }),
    prisma.visit.count({ where: { userId: user.id } }),
  ]);

  const countries = visitedPlaces
    .map((place) => place.country)
    .filter((country): country is string => Boolean(country));

  return NextResponse.json({
    stats: {
      countriesVisited: new Set(countries).size,
      citiesVisited: visitedPlaces.length,
      dreamPlacesRemaining,
      photosUploaded,
      tripsCompleted,
    },
  });
}
