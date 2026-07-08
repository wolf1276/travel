import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireServerUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { serializePlaceDetail } from '@/lib/serializers/place';
import { PLACE_INCLUDE } from '@/lib/db/placeInclude';
import { AddPlaceForm } from '@/features/places/components/AddPlaceForm';

export const metadata: Metadata = { title: 'Edit place — Travel Memories' };

export default async function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireServerUser();
  const { id } = await params;

  const place = await prisma.place.findFirst({
    where: { id, coupleId: user.coupleId },
    include: PLACE_INCLUDE,
  });

  if (!place) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Edit place</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update the details for {place.city}.</p>
      </div>
      <AddPlaceForm place={serializePlaceDetail(place)} userId={user.id} />
    </div>
  );
}
