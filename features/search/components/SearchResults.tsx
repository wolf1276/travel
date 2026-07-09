'use client';

import { SearchX } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { PlaceCardSkeleton } from '@/components/common/PlaceCardSkeleton';
import { PlaceCard } from '@/features/places/components/PlaceCard';
import { MemoryCard } from '@/features/memories/components/MemoryCard';
import type { PlaceListItem } from '@/types/place';

export function SearchResults({
  places,
  isLoading,
  isActive,
}: {
  places: PlaceListItem[] | undefined;
  isLoading: boolean;
  isActive: boolean;
}) {
  if (!isActive) {
    return (
      <EmptyState
        icon={<SearchX className="h-6 w-6" />}
        title="Search your places"
        description="Look up a place by name, address, or tag — planned or already visited."
      />
    );
  }

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
      <EmptyState icon={<SearchX className="h-6 w-6" />} title="No matches" description="Try a different name, address, or tag." />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {places.map((place) =>
        place.status === 'VISITED' ? (
          <MemoryCard key={place.id} place={place} />
        ) : (
          <PlaceCard key={place.id} place={place} />
        ),
      )}
    </div>
  );
}
