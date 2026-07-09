'use client';

import { memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ImageOff, NotebookText, UserRound } from 'lucide-react';
import { ImageWithSkeleton } from '@/components/common/ImageWithSkeleton';
import { TagBadge } from '@/components/common/TagBadge';
import { useCouple } from '@/hooks/useCouple';
import type { PlaceListItem } from '@/types/place';

export const PlaceCard = memo(function PlaceCard({ place }: { place: PlaceListItem }) {
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
        className="group block overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-shadow hover:shadow-elevated"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {place.coverImageUrl ? (
            <ImageWithSkeleton
              src={place.coverImageUrl}
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
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-primary shadow-soft backdrop-blur-sm">
            ✨ Dream
          </span>
        </div>
        <div className="space-y-2 p-5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate font-serif text-lg font-semibold text-foreground">{place.name}</h3>
            <span className="shrink-0 text-xs text-muted-foreground">
              {format(new Date(place.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
          {place.address && <p className="truncate text-sm text-muted-foreground">{place.address}</p>}
          {showAddedBy && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <UserRound className="h-3 w-3" />
              Added by {place.addedBy.displayName ?? place.addedBy.email}
            </p>
          )}
          {place.dreamNotes && (
            <p className="line-clamp-2 text-sm text-muted-foreground/90">
              <NotebookText className="mr-1 inline h-3.5 w-3.5 -translate-y-0.5" />
              {place.dreamNotes}
            </p>
          )}
          {place.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {place.tags.slice(0, 3).map((tag) => (
                <TagBadge key={tag.id} label={tag.name} />
              ))}
              {place.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">+{place.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
});
