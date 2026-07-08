import type { Metadata } from 'next';
import { WorldMap } from '@/features/map/components/WorldMapLoader';

export const metadata: Metadata = { title: 'Map — Travel Memories' };

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
