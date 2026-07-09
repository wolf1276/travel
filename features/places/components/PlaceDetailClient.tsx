'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { PlaceDreamView } from '@/features/places/components/PlaceDreamView';
import { MemoryScrapbook } from '@/features/memories/components/MemoryScrapbook';
import { MarkAsVisitedModal } from '@/features/memories/components/MarkAsVisitedModal';
import { useDeletePlace } from '@/hooks/useDeletePlace';
import type { PlaceDetail } from '@/types/place';

export function PlaceDetailClient({ place, userId }: { place: PlaceDetail; userId: string }) {
  const router = useRouter();
  const deletePlace = useDeletePlace();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [visitModalOpen, setVisitModalOpen] = useState(false);

  const isVisited = place.status === 'VISITED';

  async function handleDelete() {
    try {
      await deletePlace.mutateAsync(place.id);
      toast.success('Place deleted');
      router.push('/dashboard');
      router.refresh();
    } catch {
      toast.error('Could not delete this place.', {
        action: { label: 'Retry', onClick: () => void handleDelete() },
      });
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-semibold text-foreground">{place.city}</h1>
        <div className="flex flex-wrap items-center gap-2">
          {!isVisited && (
            <Button onClick={() => setVisitModalOpen(true)}>
              <Sparkles className="h-4 w-4" />
              Mark as visited
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/places/${place.id}/edit`}>
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {isVisited ? (
        <MemoryScrapbook place={place} userId={userId} />
      ) : (
        <PlaceDreamView place={place} />
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this place?"
        description="This will permanently remove the place and any memories, photos, and journal entries attached to it."
        confirmLabel="Delete"
        destructive
        isLoading={deletePlace.isPending}
        onConfirm={handleDelete}
      />

      <MarkAsVisitedModal
        open={visitModalOpen}
        onOpenChange={setVisitModalOpen}
        placeId={place.id}
        userId={userId}
      />
    </div>
  );
}
