'use client';

import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { BookHeart, Camera, MapPin, NotebookPen } from 'lucide-react';
import { RatingStars } from '@/components/common/RatingStars';
import { TagBadge } from '@/components/common/TagBadge';
import { MasonryGallery } from '@/features/memories/components/MasonryGallery';
import { PhotoLightbox } from '@/features/memories/components/PhotoLightbox';
import type { PlaceDetail } from '@/types/place';

export function MemoryScrapbook({ place }: { place: PlaceDetail }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const visit = place.visit;
  if (!visit) return null;

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <header className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <BookHeart className="h-4 w-4" />
          Dream
        </header>
        <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
          {place.coverImageUrl && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
              <Image
                src={place.coverImageUrl}
                alt={`${place.city}, ${place.country}`}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {place.city}, {place.country}
            </div>
            {place.dreamNotes && (
              <p className="text-sm leading-relaxed text-foreground/90">{place.dreamNotes}</p>
            )}
            {place.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {place.tags.map((tag) => (
                  <TagBadge key={tag.id} label={tag.name} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <header className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Camera className="h-4 w-4" />
          Reality
        </header>

        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card/40 p-4">
          <div>
            <p className="text-xs text-muted-foreground">Visited</p>
            <p className="font-medium">{format(new Date(visit.visitDate), 'MMMM d, yyyy')}</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Rating</p>
            <RatingStars value={visit.rating} />
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Photos</p>
            <p className="font-medium">{visit.photos.length}</p>
          </div>
        </div>

        {visit.journal && (
          <div className="space-y-2 rounded-2xl border border-border bg-card/40 p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <NotebookPen className="h-4 w-4" />
              Journal
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
              {visit.journal}
            </p>
          </div>
        )}

        {visit.photos.length > 0 ? (
          <MasonryGallery photos={visit.photos} onPhotoClick={setLightboxIndex} />
        ) : (
          <p className="text-sm text-muted-foreground">No photos added for this memory yet.</p>
        )}
      </section>

      <PhotoLightbox
        photos={visit.photos}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </div>
  );
}
