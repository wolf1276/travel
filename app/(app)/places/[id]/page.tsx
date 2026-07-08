import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireServerUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { serializePlaceDetail } from '@/lib/serializers/place';
import { PLACE_INCLUDE } from '@/lib/db/placeInclude';
import { PlaceDetailClient } from '@/features/places/components/PlaceDetailClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const place = await prisma.place.findUnique({ where: { id }, select: { city: true } });
  return { title: place ? `${place.city} — Travel Memories` : 'Travel Memories' };
}

export default async function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireServerUser();
  const { id } = await params;

  const place = await prisma.place.findFirst({
    where: { id, userId: user.id },
    include: PLACE_INCLUDE,
  });

  if (!place) notFound();

  return <PlaceDetailClient place={serializePlaceDetail(place)} userId={user.id} />;
}
