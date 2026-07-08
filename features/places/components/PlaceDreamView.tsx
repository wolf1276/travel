import Image from 'next/image';
import { ImageOff, MapPin, NotebookText, Sparkles } from 'lucide-react';
import { TagBadge } from '@/components/common/TagBadge';
import type { PlaceDetail } from '@/types/place';

export function PlaceDreamView({ place }: { place: PlaceDetail }) {
  return (
    <div className="space-y-6">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-muted">
        {place.coverImageUrl ? (
          <Image
            src={place.coverImageUrl}
            alt={`${place.city}, ${place.country}`}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-10 w-10" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        {place.city}, {place.country}
      </div>

      {place.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {place.tags.map((tag) => (
            <TagBadge key={tag.id} label={tag.name} />
          ))}
        </div>
      )}

      {place.dreamNotes && (
        <div className="space-y-2 rounded-2xl border border-border bg-card/40 p-5">
          <div className="flex items-center gap-2 text-sm font-medium">
            <NotebookText className="h-4 w-4" />
            Dream notes
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {place.dreamNotes}
          </p>
        </div>
      )}

      {place.personalReason && (
        <div className="space-y-2 rounded-2xl border border-border bg-card/40 p-5">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Why this place
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {place.personalReason}
          </p>
        </div>
      )}
    </div>
  );
}
