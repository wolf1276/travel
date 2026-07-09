'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

/** A single autocomplete suggestion - cheap to fetch, no coordinates yet.
 * Call `fetchPlaceDetails` with its id once the user picks one. */
export interface PlacePrediction {
  id: string;
  name: string;
  address: string;
}

/** The full record persisted onto a Place once a prediction is resolved via
 * Place Details (or filled in by hand when search fails/is unavailable). */
export interface LocationSuggestion {
  name: string;
  address: string | null;
  country: string | null;
  countryCode: string | null;
  latitude: number | null;
  longitude: number | null;
  placeProviderId: string | null;
}

interface AutocompletePrediction {
  placePrediction?: {
    placeId: string;
    text?: { text: string };
    structuredFormat?: {
      mainText?: { text: string };
      secondaryText?: { text: string };
    };
  };
}

interface PlaceDetailsResponse {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  addressComponents?: { longText: string; shortText: string; types: string[] }[];
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function toPrediction(entry: AutocompletePrediction): PlacePrediction | null {
  const prediction = entry.placePrediction;
  if (!prediction) return null;
  return {
    id: prediction.placeId,
    name: prediction.structuredFormat?.mainText?.text ?? prediction.text?.text ?? '',
    address: prediction.structuredFormat?.secondaryText?.text ?? '',
  };
}

/** Place search backed by the Google Places API ("New") Autocomplete
 * endpoint. Returns an empty, inert result set when
 * NEXT_PUBLIC_GOOGLE_MAPS_API_KEY isn't configured, so the Add Place form
 * still works for fully manual entry. */
export function useLocationSearch(query: string) {
  const debounced = useDebounce(query, 300);
  const [results, setResults] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || debounced.trim().length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
      },
      body: JSON.stringify({ input: debounced }),
    })
      .then((response) => response.json())
      .then((data: { suggestions?: AutocompletePrediction[] }) => {
        const predictions = (data.suggestions ?? [])
          .map(toPrediction)
          .filter((p): p is PlacePrediction => p !== null);
        setResults(predictions);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setResults([]);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [debounced]);

  return { results, isLoading, hasToken: Boolean(GOOGLE_MAPS_API_KEY) };
}

/** Resolves a prediction's placeId into coordinates + a formatted address via
 * Place Details. Returns null on failure so callers can fall back to manual
 * entry instead of losing the user's selection. */
export async function fetchPlaceDetails(placeId: string): Promise<LocationSuggestion | null> {
  if (!GOOGLE_MAPS_API_KEY) return null;

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,addressComponents',
      },
    });
    if (!response.ok) return null;

    const data = (await response.json()) as PlaceDetailsResponse;
    const country = data.addressComponents?.find((c) => c.types.includes('country'));

    return {
      name: data.displayName?.text ?? '',
      address: data.formattedAddress ?? null,
      country: country?.longText ?? null,
      countryCode: country?.shortText?.toUpperCase() ?? null,
      latitude: data.location?.latitude ?? null,
      longitude: data.location?.longitude ?? null,
      placeProviderId: data.id,
    };
  } catch {
    return null;
  }
}
