'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export interface LocationSuggestion {
  id: string;
  city: string;
  country: string;
  countryCode: string | null;
  latitude: number;
  longitude: number;
}

interface MapboxFeature {
  id: string;
  text: string;
  center: [number, number];
  context?: { id: string; text: string; short_code?: string }[];
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function toSuggestion(feature: MapboxFeature): LocationSuggestion {
  const countryContext = feature.context?.find((entry) => entry.id.startsWith('country'));
  return {
    id: feature.id,
    city: feature.text,
    country: countryContext?.text ?? '',
    countryCode: countryContext?.short_code?.toUpperCase() ?? null,
    longitude: feature.center[0],
    latitude: feature.center[1],
  };
}

/** City autocomplete backed by the Mapbox Geocoding API. Returns an empty,
 * inert result set when NEXT_PUBLIC_MAPBOX_TOKEN isn't configured yet, so
 * the Add Place form still works for fully manual entry. */
export function useLocationSearch(query: string) {
  const debounced = useDebounce(query, 300);
  const [results, setResults] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!MAPBOX_TOKEN || debounced.trim().length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(debounced)}.json?types=place&limit=6&access_token=${MAPBOX_TOKEN}`,
      { signal: controller.signal },
    )
      .then((response) => response.json())
      .then((data: { features?: MapboxFeature[] }) => {
        setResults((data.features ?? []).map(toSuggestion));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setResults([]);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [debounced]);

  return { results, isLoading, hasToken: Boolean(MAPBOX_TOKEN) };
}
