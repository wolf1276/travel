import type { Metadata } from 'next';
import { WorldMap } from '@/features/map/components/WorldMapLoader';

export const metadata: Metadata = { title: 'Map — Travel Memories' };

export default function MapPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">🗺 Our world</h1>
        <p className="text-sm text-muted-foreground">Coral pins are dreams, sage pins are memories.</p>
      </div>
      <WorldMap />
    </div>
  );
}
