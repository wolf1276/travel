'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { APIProvider, InfoWindow, Map, Marker } from '@vis.gl/react-google-maps';
import { Map as MapIcon } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { usePlaces } from '@/hooks/usePlaces';
import { romanticMapStyleDark, romanticMapStyleLight } from '@/features/map/lib/mapStyles';
import type { PlaceListItem } from '@/types/place';

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const DREAM_PIN_COLOR = '#db768d';
const MEMORY_PIN_COLOR = '#718f5c';

type MappablePlace = PlaceListItem & {
  latitude: number;
  longitude: number;
  kind: 'dream' | 'memory';
};

function buildPinIcon(color: string, active: boolean): google.maps.Icon {
  const size = active ? 40 : 32;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><path d="M12 0C7.03 0 3 4.03 3 9c0 6.25 9 15 9 15s9-8.75 9-15c0-4.97-4.03-9-9-9z" fill="${color}" stroke="#fffdf9" stroke-width="1.2"/><circle cx="12" cy="9" r="3.4" fill="#fffdf9"/></svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(size / 2, size - 1),
  };
}

function WorldMapInner() {
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

  if (isLoading) {
    return <Skeleton className="h-[calc(100dvh-13rem)] min-h-[420px] w-full rounded-[2rem]" />;
  }

  const activePlace = points.find((place) => place.id === activeId) ?? null;

  return (
    <div className="h-[calc(100dvh-13rem)] min-h-[420px] w-full overflow-hidden rounded-[2rem] border border-border/70 shadow-soft">
      <Map
        defaultCenter={{ lat: 20, lng: 10 }}
        defaultZoom={1.4}
        minZoom={1.2}
        gestureHandling="greedy"
        disableDefaultUI
        zoomControl
        styles={resolvedTheme === 'dark' ? romanticMapStyleDark : romanticMapStyleLight}
        style={{ width: '100%', height: '100%' }}
        onClick={() => setActiveId(null)}
      >
        {points.map((place) => (
          <Marker
            key={place.id}
            position={{ lat: place.latitude, lng: place.longitude }}
            icon={buildPinIcon(
              place.kind === 'memory' ? MEMORY_PIN_COLOR : DREAM_PIN_COLOR,
              activeId === place.id,
            )}
            onClick={() => setActiveId(place.id)}
          />
        ))}

        {activePlace && (
          <InfoWindow
            position={{ lat: activePlace.latitude, lng: activePlace.longitude }}
            onCloseClick={() => setActiveId(null)}
            headerDisabled
            pixelOffset={[0, -8]}
          >
            <button
              type="button"
              onClick={() => router.push(`/places/${activePlace.id}`)}
              className="flex max-w-[220px] flex-col gap-0.5 rounded-lg px-1 py-1 text-left"
            >
              <span className="font-serif text-sm font-semibold text-foreground">{activePlace.name}</span>
              {activePlace.address && (
                <span className="truncate text-xs text-muted-foreground">{activePlace.address}</span>
              )}
            </button>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}

export function WorldMap() {
  if (!GOOGLE_MAPS_KEY) {
    return (
      <EmptyState
        icon={<MapIcon className="h-6 w-6" />}
        title="Map not connected yet"
        description="Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment to see your places on an interactive world map."
      />
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_KEY}>
      <WorldMapInner />
    </APIProvider>
  );
}
