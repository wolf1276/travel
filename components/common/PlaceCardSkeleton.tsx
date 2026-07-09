import { Skeleton } from '@/components/ui/skeleton';

export function PlaceCardSkeleton() {
  return (
    <div className="polaroid bg-card/60">
      <Skeleton className="aspect-[4/3] w-full rounded-sm" />
      <div className="space-y-2 px-1.5 pt-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
