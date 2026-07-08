import Image from 'next/image';
import { Star } from 'lucide-react';

export interface GalleryPhoto {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
  isFavorite: boolean;
  caption: string | null;
}

export function MasonryGallery({
  photos,
  onPhotoClick,
}: {
  photos: GalleryPhoto[];
  onPhotoClick: (index: number) => void;
}) {
  return (
    <div className="masonry-columns">
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          type="button"
          onClick={() => onPhotoClick(index)}
          className="masonry-item group relative block w-full overflow-hidden rounded-xl border border-border"
        >
          <Image
            src={photo.url}
            alt={photo.caption ?? ''}
            width={photo.width ?? 800}
            height={photo.height ?? 600}
            className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
          {photo.isFavorite && (
            <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-yellow-400">
              <Star className="h-3.5 w-3.5 fill-current" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
