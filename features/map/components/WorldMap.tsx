'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map as MapIcon, MapPin } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { usePlaces } from '@/hooks/usePlaces';
import { cn } from '@/lib/utils';
import type { PlaceListItem } from '@/types/place';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type MappablePlace = PlaceListItem & {
  latitude: number;
  longitude: number;
  kind: 'dream' | 'memory';
};

export function WorldMap() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { data: wantToVisit, isLoading: isLoadingDreams } = usePlaces('WANT_TO_VISIT');
  const { data: visited, isLoading: isLoadingVisited } = usePlaces('VISITED');
  const [activeId, setActiveId] = useState<string | null>(null);
  const isLoading = isLoadingDreams || isLoadingVisited;

  const points = useMemo<MappablePlace[]>(() => {
    const withCoords = (places: PlaceListItem[] | undefined, kind: MappablePlace['kind']) =>
      (places ?? [])
        .filter((place): place is PlaceListItem & { latitude: number; longitude: number } =>
          place.latitude !== null && place.longitude !== null,
        )
        .map((place) => ({ ...place, kind }));

    return [...withCoords(wantToVisit, 'dream'), ...withCoords(visited, 'memory')];
  }, [wantToVisit, visited]);

  if (!MAPBOX_TOKEN) {
    return (
      <EmptyState
        icon={MapIcon}
        title="Map not connected yet"
        description="Add NEXT_PUBLIC_MAPBOX_TOKEN to your environment to see your places on an interactive world map."
      />
    );
  }

  const activePlace = points.find((place) => place.id === activeId) ?? null;

  if (isLoading) {
    return <Skeleton className="h-[calc(100dvh-13rem)] min-h-[420px] w-full rounded-2xl" />;
  }

  return (
    <div className="h-[calc(100dvh-13rem)] min-h-[420px] w-full overflow-hidden rounded-3xl border border-border/70 shadow-soft">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{ longitude: 10, latitude: 20, zoom: 1.4 }}
        mapStyle={
          resolvedTheme === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11'
        }
        style={{ width: '100%', height: '100%' }}
        onClick={() => setActiveId(null)}
      >
        <NavigationControl position="top-right" />

        {points.map((place) => (
          <Marker
            key={place.id}
            longitude={place.longitude}
            latitude={place.latitude}
            anchor="bottom"
            onClick={(event) => {
              event.originalEvent.stopPropagation();
              setActiveId(place.id);
            }}
          >
            <MapPin
              className={cn(
                'h-7 w-7 cursor-pointer drop-shadow-md transition-transform hover:scale-110',
                place.kind === 'memory' ? 'fill-success text-success' : 'fill-primary text-primary',
              )}
            />
          </Marker>
        ))}

        {activePlace && (
          <Popup
            longitude={activePlace.longitude}
            latitude={activePlace.latitude}
            anchor="top"
            onClose={() => setActiveId(null)}
            closeButton={false}
            className="[&_.mapboxgl-popup-content]:rounded-xl [&_.mapboxgl-popup-content]:bg-popover [&_.mapboxgl-popup-content]:p-0 [&_.mapboxgl-popup-content]:text-popover-foreground [&_.mapboxgl-popup-content]:shadow-elevated [&_.mapboxgl-popup-tip]:border-t-popover"
          >
            <button
              type="button"
              onClick={() => router.push(`/places/${activePlace.id}`)}
              className="flex flex-col gap-0.5 px-3 py-2 text-left"
            >
              <span className="text-sm font-medium">{activePlace.city}</span>
              <span className="text-xs text-muted-foreground">{activePlace.country}</span>
            </button>
          </Popup>
        )}
      </Map>
    </div>
  );
}
