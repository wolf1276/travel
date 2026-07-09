import { memo } from 'react';
import { Star } from 'lucide-react';
import { ImageWithSkeleton } from '@/components/common/ImageWithSkeleton';
import type { Attribution } from '@/types/place';

export interface GalleryPhoto {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
  isFavorite: boolean;
  caption: string | null;
  uploadedBy: Attribution;
}

export const MasonryGallery = memo(function MasonryGallery({
  photos,
  onPhotoClick,
  showAttribution = false,
}: {
  photos: GalleryPhoto[];
  onPhotoClick: (index: number) => void;
  showAttribution?: boolean;
}) {
  return (
    <div className="masonry-columns">
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          type="button"
          onClick={() => onPhotoClick(index)}
          className="masonry-item group relative block w-full overflow-hidden rounded-2xl border border-border/70 shadow-soft transition-shadow hover:shadow-elevated"
        >
          <ImageWithSkeleton
            src={photo.url}
            alt={photo.caption || 'Travel photo'}
            width={photo.width ?? 800}
            height={photo.height ?? 600}
            className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
          {photo.isFavorite && (
            <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-amber-300">
              <Star className="h-3.5 w-3.5 fill-current" />
            </div>
          )}
          {showAttribution && (
            <div className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 text-left text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
              Uploaded by {photo.uploadedBy.displayName ?? photo.uploadedBy.email}
            </div>
          )}
        </button>
      ))}
    </div>
  );
});
