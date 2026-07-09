import { Skeleton } from '@/components/ui/skeleton';

export function PlaceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/40">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
