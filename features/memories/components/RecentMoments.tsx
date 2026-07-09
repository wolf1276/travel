'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithSkeleton } from '@/components/common/ImageWithSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { usePlaces } from '@/hooks/usePlaces';
import { cn } from '@/lib/utils';

export function RecentMoments() {
  const { data: places, isLoading } = usePlaces('VISITED');
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', dragFree: true, containScroll: 'trimSnaps' });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

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
    <div className="group/carousel relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {moments.map((place) => (
            <Link
              key={place.id}
              href={`/places/${place.id}`}
              className="group relative h-40 w-40 shrink-0 overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-soft transition-shadow hover:shadow-dreamy sm:h-44 sm:w-44"
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
      </div>

      {(canScrollPrev || canScrollNext) && (
        <>
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Previous moments"
            className={cn(
              'absolute -left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-card/95 shadow-soft transition-opacity sm:flex',
              !canScrollPrev && 'pointer-events-none opacity-0',
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Next moments"
            className={cn(
              'absolute -right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-card/95 shadow-soft transition-opacity sm:flex',
              !canScrollNext && 'pointer-events-none opacity-0',
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}
