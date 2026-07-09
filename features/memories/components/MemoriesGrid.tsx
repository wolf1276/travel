'use client';

import Link from 'next/link';
import { Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';
import { PlaceCardSkeleton } from '@/components/common/PlaceCardSkeleton';
import { MemoryCard } from '@/features/memories/components/MemoryCard';
import { useInfinitePlaces } from '@/hooks/useInfinitePlaces';
import { useInfiniteScrollTrigger } from '@/hooks/useInfiniteScrollTrigger';

export function MemoriesGrid() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfinitePlaces('VISITED');

  const places = data?.pages.flatMap((page) => page.places) ?? [];

  const sentinelRef = useInfiniteScrollTrigger(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, Boolean(hasNextPage));

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <PlaceCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <EmptyState
        icon={<Camera className="h-6 w-6" />}
        title="No memories yet"
        description="Mark a dream place as visited to start filling your scrapbook."
        action={
          <Button asChild variant="outline">
            <Link href="/dashboard">Browse your dream list</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {places.map((place, index) => (
          <MemoryCard key={place.id} place={place} index={index} />
        ))}
      </div>
      {hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center py-6">
          {isFetchingNextPage && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        </div>
      )}
    </div>
  );
}
