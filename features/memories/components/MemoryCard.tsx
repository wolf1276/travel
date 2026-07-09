'use client';

import { memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Camera, ImageOff, UserRound } from 'lucide-react';
import { ImageWithSkeleton } from '@/components/common/ImageWithSkeleton';
import { RatingStars } from '@/components/common/RatingStars';
import { useCouple } from '@/hooks/useCouple';
import { tiltForId } from '@/lib/rotation';
import type { PlaceListItem } from '@/types/place';

export const MemoryCard = memo(function MemoryCard({
  place,
  index = 0,
}: {
  place: PlaceListItem;
  index?: number;
}) {
  const visit = place.visit;
  const coverUrl = visit?.favoritePhotoUrl ?? place.coverImageUrl;
  const { data: couple } = useCouple();
  const showAddedBy = (couple?.members.length ?? 0) > 1;
  const tilt = tiltForId(place.id) * -1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: tilt }}
      whileHover={{ y: -6, rotate: 0, scale: 1.02 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: Math.min(index * 0.05, 0.4) }}
    >
      <Link
        href={`/places/${place.id}`}
        className="polaroid group block bg-card shadow-polaroid transition-shadow hover:shadow-dreamy"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-muted">
          {coverUrl ? (
            <ImageWithSkeleton
              src={coverUrl}
              alt={place.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageOff className="h-8 w-8" />
            </div>
          )}
          <span className="absolute left-2.5 top-2.5 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-success shadow-soft backdrop-blur-sm">
            ❤️ Memory
          </span>
          {visit && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
              <Camera className="h-3 w-3" />
              {visit.photoCount}
            </div>
          )}
        </div>
        <div className="space-y-1.5 px-1.5 pt-3">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate font-accent text-lg font-semibold text-foreground">{place.name}</h3>
            {visit && (
              <span className="shrink-0 text-xs text-muted-foreground">
                {format(new Date(visit.visitDate), 'MMM d, yyyy')}
              </span>
            )}
          </div>
          {place.address && <p className="truncate text-sm text-muted-foreground">{place.address}</p>}
          {showAddedBy && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <UserRound className="h-3 w-3" />
              Added by {place.addedBy.displayName ?? place.addedBy.email}
            </p>
          )}
          {visit?.rating !== undefined && visit?.rating !== null && (
            <RatingStars value={visit.rating} size="sm" />
          )}
          {visit?.journal && (
            <p className="line-clamp-2 text-sm text-muted-foreground/90">{visit.journal}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
});
