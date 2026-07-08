import { Skeleton } from '@/components/ui/skeleton';

export default function EditPlaceLoading() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-8">
        <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
        <Skeleton className="h-10 w-full rounded-md" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <Skeleton className="h-24 w-full rounded-md" />
        <Skeleton className="h-20 w-full rounded-md" />
      </div>
    </div>
  );
}
