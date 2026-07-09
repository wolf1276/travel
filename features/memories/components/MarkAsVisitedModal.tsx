'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DatePicker } from '@/components/common/DatePicker';
import { RatingStars } from '@/components/common/RatingStars';
import { PhotoDropzone, type PendingPhoto } from '@/features/memories/components/PhotoDropzone';
import { useMarkAsVisited } from '@/hooks/useMarkAsVisited';

export function MarkAsVisitedModal({
  open,
  onOpenChange,
  placeId,
  userId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeId: string;
  userId: string;
}) {
  const router = useRouter();
  const markAsVisited = useMarkAsVisited(placeId);

  const [visitDate, setVisitDate] = useState<Date | null>(new Date());
  const [rating, setRating] = useState<number | null>(null);
  const [journal, setJournal] = useState('');
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [favoriteIndex, setFavoriteIndex] = useState<number | null>(null);

  async function handleSubmit() {
    if (!visitDate) {
      toast.error('Pick the date you visited');
      return;
    }

    try {
      await markAsVisited.mutateAsync({
        visitDate: visitDate.toISOString(),
        rating,
        journal: journal.trim() || null,
        photos: photos.map(({ url, path, width, height }) => ({ url, path, width, height })),
        favoritePhotoIndex: favoriteIndex,
      });
      toast.success('Memory saved');
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error('Could not save this memory.', {
        action: { label: 'Retry', onClick: () => void handleSubmit() },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Mark as visited</DialogTitle>
          <DialogDescription>Turn this dream into a memory.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Visit date</Label>
              <DatePicker value={visitDate} onChange={setVisitDate} />
            </div>
            <div className="space-y-2">
              <Label>Rating (optional)</Label>
              <div className="flex h-10 items-center">
                <RatingStars value={rating} onChange={setRating} size="lg" readOnly={false} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Journal</Label>
            <Textarea
              value={journal}
              onChange={(event) => setJournal(event.target.value)}
              placeholder="How did it feel to finally be there?"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Photos</Label>
            <PhotoDropzone
              photos={photos}
              onChange={setPhotos}
              favoriteIndex={favoriteIndex}
              onFavoriteChange={setFavoriteIndex}
              folder={`${userId}/visits/${placeId}`}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={markAsVisited.isPending}>
            {markAsVisited.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save memory
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
