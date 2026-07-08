'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ImageOff, NotebookText } from 'lucide-react';
import { TagBadge } from '@/components/common/TagBadge';
import type { PlaceListItem } from '@/types/place';

export function PlaceCard({ place }: { place: PlaceListItem }) {
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
          {place.coverImageUrl ? (
            <Image
              src={place.coverImageUrl}
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
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate font-semibold">{place.city}</h3>
            <span className="shrink-0 text-xs text-muted-foreground">
              {format(new Date(place.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{place.country}</p>
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
}
