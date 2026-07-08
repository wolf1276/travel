'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Camera, ImageOff, UserRound } from 'lucide-react';
import { RatingStars } from '@/components/common/RatingStars';
import { useCouple } from '@/hooks/useCouple';
import type { PlaceListItem } from '@/types/place';

export function MemoryCard({ place }: { place: PlaceListItem }) {
  const visit = place.visit;
  const coverUrl = visit?.favoritePhotoUrl ?? place.coverImageUrl;
  const { data: couple } = useCouple();
  const showAddedBy = (couple?.members.length ?? 0) > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Link
        href={`/places/${place.id}`}
        className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-elevated"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={`${place.city}, ${place.country}`}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageOff className="h-8 w-8" />
            </div>
          )}
          {visit && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
              <Camera className="h-3 w-3" />
              {visit.photoCount}
            </div>
          )}
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate font-semibold">{place.city}</h3>
            {visit && (
              <span className="shrink-0 text-xs text-muted-foreground">
                {format(new Date(visit.visitDate), 'MMM d, yyyy')}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{place.country}</p>
          {showAddedBy && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <UserRound className="h-3 w-3" />
              Added by {place.addedBy.displayName ?? place.addedBy.email}
            </p>
          )}
          {visit && <RatingStars value={visit.rating} size="sm" />}
          {visit?.journal && (
            <p className="line-clamp-2 text-sm text-muted-foreground/90">{visit.journal}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
