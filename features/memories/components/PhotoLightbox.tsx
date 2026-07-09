'use client';

import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { Star } from 'lucide-react';
import type { GalleryPhoto } from '@/features/memories/components/MasonryGallery';

export function PhotoLightbox({
  photos,
  index,
  onIndexChange,
  onClose,
  showAttribution = false,
}: {
  photos: GalleryPhoto[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  showAttribution?: boolean;
}) {
  return (
    <Lightbox
      open={index !== null}
      close={onClose}
      index={index ?? 0}
      slides={photos.map((photo) => ({
        src: photo.url,
        width: photo.width ?? undefined,
        height: photo.height ?? undefined,
        alt: photo.caption || 'Travel photo',
      }))}
      plugins={[Zoom]}
      on={{ view: ({ index: nextIndex }) => onIndexChange(nextIndex) }}
      animation={{ fade: 250, swipe: 250 }}
      carousel={{ finite: false }}
      render={{
        slideFooter: ({ slide }) => {
          const photo = photos.find((p) => p.url === slide.src);
          if (!photo) return null;
          return (
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
              {photo.isFavorite && (
                <span className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-amber-300">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  Favorite
                </span>
              )}
              {showAttribution && (
                <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">
                  Uploaded by {photo.uploadedBy.displayName ?? photo.uploadedBy.email}
                </span>
              )}
            </div>
          );
        },
      }}
    />
  );
}
