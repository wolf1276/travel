'use client';

import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';
import { PlaceCardSkeleton } from '@/components/common/PlaceCardSkeleton';
import { PlaceCard } from '@/features/places/components/PlaceCard';
import { usePlaces } from '@/hooks/usePlaces';

export function WantToVisitGrid() {
  const { data: places, isLoading } = usePlaces('WANT_TO_VISIT');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <PlaceCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!places || places.length === 0) {
    return (
      <EmptyState
        icon={<Compass className="h-6 w-6" />}
        title="No dream places yet"
        description="Start your scrapbook by saving somewhere you'd love to visit one day."
        action={
          <Button asChild>
            <Link href="/places/new">Add your first place</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {places.map((place, index) => (
        <PlaceCard key={place.id} place={place} index={index} />
      ))}
    </div>
  );
}
