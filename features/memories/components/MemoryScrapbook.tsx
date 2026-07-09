'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { BookHeart, Camera, ImageOff, ImagePlus, Loader2, MapPin, NotebookPen, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';
import { ImageWithSkeleton } from '@/components/common/ImageWithSkeleton';
import { RatingStars } from '@/components/common/RatingStars';
import { TagBadge } from '@/components/common/TagBadge';
import { MasonryGallery } from '@/features/memories/components/MasonryGallery';
import { PhotoLightbox } from '@/features/memories/components/PhotoLightbox';
import { PhotoDropzone, type PendingPhoto } from '@/features/memories/components/PhotoDropzone';
import { useCouple } from '@/hooks/useCouple';
import { useAddPhotos } from '@/hooks/useAddPhotos';
import type { PlaceDetail } from '@/types/place';

export function MemoryScrapbook({ place, userId }: { place: PlaceDetail; userId: string }) {
  const router = useRouter();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isAddingPhotos, setIsAddingPhotos] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [pendingFavoriteIndex, setPendingFavoriteIndex] = useState<number | null>(null);
  const { data: couple } = useCouple();
  const addPhotos = useAddPhotos(place.id);
  const showAttribution = (couple?.members.length ?? 0) > 1;

  const visit = place.visit;
  if (!visit) return null;

  async function handleAddPhotos() {
    if (pendingPhotos.length === 0) return;
    try {
      await addPhotos.mutateAsync({
        photos: pendingPhotos.map(({ url, path, width, height }) => ({ url, path, width, height })),
      });
      toast.success('Photos added');
      setPendingPhotos([]);
      setPendingFavoriteIndex(null);
      setIsAddingPhotos(false);
      router.refresh();
    } catch {
      toast.error('Could not add these photos.', {
        action: { label: 'Retry', onClick: () => void handleAddPhotos() },
      });
    }
  }

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <header className="flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
          <BookHeart className="h-4 w-4 text-primary" />
          The dream
        </header>
        <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
          {place.coverImageUrl && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/70 shadow-soft">
              <ImageWithSkeleton
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
        <header className="flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
          <Camera className="h-4 w-4 text-primary" />
          The memory
        </header>

        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/70 bg-card/60 p-4 shadow-soft">
          <div>
            <p className="text-xs text-muted-foreground">Visited</p>
            <p className="font-medium">{format(new Date(visit.visitDate), 'MMMM d, yyyy')}</p>
          </div>
          {visit.rating !== null && (
            <>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-xs text-muted-foreground">Rating</p>
                <RatingStars value={visit.rating} />
              </div>
            </>
          )}
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Photos</p>
            <p className="font-medium">{visit.photos.length}</p>
          </div>
          {showAttribution && (
            <>
              <div className="h-8 w-px bg-border" />
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <UserRound className="h-3 w-3" />
                Visited by {visit.visitedBy.displayName ?? visit.visitedBy.email}
              </p>
            </>
          )}
        </div>

        {visit.journal && (
          <div className="space-y-2 rounded-2xl border border-border/70 bg-card/60 p-5 shadow-soft">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <NotebookPen className="h-4 w-4 text-primary" />
              Journal
            </div>
            <p className="whitespace-pre-line font-serif text-base leading-relaxed text-foreground/90">
              {visit.journal}
            </p>
          </div>
        )}

        {visit.photos.length > 0 ? (
          <MasonryGallery
            photos={visit.photos}
            onPhotoClick={setLightboxIndex}
            showAttribution={showAttribution}
          />
        ) : (
          <EmptyState
            icon={ImageOff}
            title="No photos uploaded"
            description="Add photos from your trip to bring this memory to life."
            className="py-10"
          />
        )}

        {isAddingPhotos ? (
          <div className="space-y-3 rounded-2xl border border-border/70 bg-card/60 p-4 shadow-soft">
            <PhotoDropzone
              photos={pendingPhotos}
              onChange={setPendingPhotos}
              favoriteIndex={pendingFavoriteIndex}
              onFavoriteChange={setPendingFavoriteIndex}
              folder={`${userId}/visits/${place.id}`}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddingPhotos(false);
                  setPendingPhotos([]);
                  setPendingFavoriteIndex(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddPhotos}
                disabled={pendingPhotos.length === 0 || addPhotos.isPending}
              >
                {addPhotos.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Save photos
              </Button>
            </div>
          </div>
        ) : (
          <Button type="button" variant="outline" onClick={() => setIsAddingPhotos(true)}>
            <ImagePlus className="h-4 w-4" />
            Add photos
          </Button>
        )}
      </section>

      <PhotoLightbox
        photos={visit.photos}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
        showAttribution={showAttribution}
      />
    </div>
  );
}
