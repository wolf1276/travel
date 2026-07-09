'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { CalendarHeart, MapPin } from 'lucide-react';
import { ImageWithSkeleton } from '@/components/common/ImageWithSkeleton';
import { RatingStars } from '@/components/common/RatingStars';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { usePlaces } from '@/hooks/usePlaces';
import type { PlaceListItem } from '@/types/place';

export function Timeline() {
  const { data: places, isLoading } = usePlaces('VISITED');

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  const visited = (places ?? []).filter((place) => place.visit);

  if (visited.length === 0) {
    return (
      <EmptyState
        icon={<CalendarHeart className="h-6 w-6" />}
        title="Your timeline is waiting"
        description="Once you mark places as visited, your journey will unfold here, year by year."
        className="py-12"
      />
    );
  }

  const byYear = new Map<number, PlaceListItem[]>();
  for (const place of visited) {
    const year = new Date(place.visit!.visitDate).getFullYear();
    const bucket = byYear.get(year) ?? [];
    bucket.push(place);
    byYear.set(year, bucket);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);
  for (const year of years) {
    byYear.get(year)!.sort((a, b) => new Date(b.visit!.visitDate).getTime() - new Date(a.visit!.visitDate).getTime());
  }

  return (
    <div className="space-y-10">
      {years.map((year) => (
        <div key={year}>
          <h3 className="mb-4 font-serif text-2xl font-semibold text-foreground">{year}</h3>
          <div className="relative space-y-5 border-l-2 border-dashed border-border pl-6">
            {byYear.get(year)!.map((place) => (
              <Link
                key={place.id}
                href={`/places/${place.id}`}
                className="group relative block rounded-2xl border border-border/70 bg-card/60 p-3.5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated sm:p-4"
              >
                <span className="absolute -left-[1.9rem] top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-background">
                  <MapPin className="h-2.5 w-2.5" />
                </span>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {(place.visit?.favoritePhotoUrl ?? place.coverImageUrl) && (
                      <ImageWithSkeleton
                        src={place.visit!.favoritePhotoUrl ?? place.coverImageUrl!}
                        alt={`${place.city}, ${place.country}`}
                        fill
                        sizes="64px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                      <p className="truncate font-semibold text-foreground">
                        {place.city}, {place.country}
                      </p>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {format(new Date(place.visit!.visitDate), 'MMMM d')}
                      </span>
                    </div>
                    {place.visit?.rating !== null && place.visit?.rating !== undefined && (
                      <RatingStars value={place.visit.rating} size="sm" />
                    )}
                    {place.visit?.journal && (
                      <p className="line-clamp-1 text-sm text-muted-foreground/90">{place.visit.journal}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
