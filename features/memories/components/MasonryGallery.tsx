import { memo, useMemo } from 'react';
import { MasonryPhotoAlbum, type Photo } from 'react-photo-album';
import 'react-photo-album/masonry.css';
import { Star } from 'lucide-react';
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
  const albumPhotos = useMemo<Photo[]>(
    () =>
      photos.map((photo) => ({
        key: photo.id,
        src: photo.url,
        width: photo.width ?? 800,
        height: photo.height ?? 600,
        alt: photo.caption || 'Travel photo',
      })),
    [photos],
  );

  return (
    <MasonryPhotoAlbum
      photos={albumPhotos}
      columns={(width) => (width < 640 ? 1 : width < 1024 ? 2 : 3)}
      spacing={16}
      onClick={({ index }) => onPhotoClick(index)}
      componentsProps={{
        image: { className: 'rounded-2xl border border-border/70 shadow-soft transition-shadow hover:shadow-elevated' },
        button: { className: 'group cursor-pointer' },
      }}
      render={{
        extras: (_, { index, width, height }) => {
          const photo = photos[index];
          if (!photo) return null;
          return (
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
              style={{ width, height }}
            >
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
            </div>
          );
        },
      }}
    />
  );
});
