'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ImageWithSkeleton } from '@/components/common/ImageWithSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { usePlaces } from '@/hooks/usePlaces';

export function RecentMoments() {
  const { data: places, isLoading } = usePlaces('VISITED');

  const moments = (places ?? [])
    .filter((place) => place.visit && (place.visit.favoritePhotoUrl || place.coverImageUrl))
    .sort((a, b) => new Date(b.visit!.visitDate).getTime() - new Date(a.visit!.visitDate).getTime())
    .slice(0, 8);

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-40 w-40 shrink-0 rounded-2xl sm:h-44 sm:w-44" />
        ))}
      </div>
    );
  }

  if (moments.length === 0) return null;

  return (
    <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-1">
      {moments.map((place) => (
        <Link
          key={place.id}
          href={`/places/${place.id}`}
          className="group relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft transition-shadow hover:shadow-elevated sm:h-44 sm:w-44"
        >
          <ImageWithSkeleton
            src={place.visit!.favoritePhotoUrl ?? place.coverImageUrl!}
            alt={place.name}
            fill
            sizes="176px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent px-3 pb-2.5 pt-8 text-left">
            <p className="truncate text-sm font-medium text-white">{place.name}</p>
            <p className="text-[11px] text-white/75">{format(new Date(place.visit!.visitDate), 'MMM yyyy')}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
