import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-border bg-card/40 p-4">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="mt-3 h-7 w-12" />
            <Skeleton className="mt-1 h-3 w-20" />
          </div>
        ))}
      </div>

      <Skeleton className="h-32 w-full rounded-2xl" />

      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-full" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-20 w-full rounded-md" />
      </div>
    </div>
  );
}
