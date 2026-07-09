import type { Metadata } from 'next';
import { requireServerUser } from '@/lib/auth';
import { AddPlaceForm } from '@/features/places/components/AddPlaceForm';

export const metadata: Metadata = { title: 'Add a place — Travel Memories' };

export default async function NewPlacePage() {
  const user = await requireServerUser();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-foreground">Add a place</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Any place you want to visit together — a cafe, a beach, a hidden spot.
        </p>
      </div>
      <AddPlaceForm userId={user.id} />
    </div>
  );
}
