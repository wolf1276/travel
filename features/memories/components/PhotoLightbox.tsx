'use client';

import { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, X } from 'lucide-react';
import { ImageWithSkeleton } from '@/components/common/ImageWithSkeleton';
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
  const isOpen = index !== null;
  const photo = index !== null ? photos[index] : null;

  const goNext = useCallback(() => {
    if (index === null) return;
    onIndexChange((index + 1) % photos.length);
  }, [index, photos.length, onIndexChange]);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onIndexChange((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onIndexChange]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') goNext();
      if (event.key === 'ArrowLeft') goPrev();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, goNext, goPrev, onClose]);

  return (
    <AnimatePresence>
      {isOpen && photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous photo"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goNext();
                }}
                aria-label="Next photo"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <motion.div
            key={photo.id}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-h-[85vh] max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <ImageWithSkeleton
              src={photo.url}
              alt={photo.caption || 'Travel photo'}
              width={photo.width ?? 1200}
              height={photo.height ?? 900}
              className="max-h-[85vh] w-auto rounded-2xl object-contain"
            />
            {photo.isFavorite && (
              <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-amber-300">
                <Star className="h-3.5 w-3.5 fill-current" />
                Favorite
              </div>
            )}
            {showAttribution && (
              <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">
                Uploaded by {photo.uploadedBy.displayName ?? photo.uploadedBy.email}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
