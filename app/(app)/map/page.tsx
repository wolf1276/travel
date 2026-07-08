import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = { title: 'Map — Travel Memories' };

const WorldMap = dynamic(
  () => import('@/features/map/components/WorldMap').then((mod) => mod.WorldMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[calc(100vh-13rem)] min-h-[420px] w-full rounded-2xl" />,
  },
);

export default function MapPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Map</h1>
        <p className="text-sm text-muted-foreground">Blue for dreams, green for memories.</p>
      </div>
      <WorldMap />
    </div>
  );
}
