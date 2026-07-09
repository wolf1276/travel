import { Skeleton } from '@/components/ui/skeleton';

export default function InviteAcceptLoading() {
  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-border bg-card/40 p-6">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-4 w-full" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}
