'use client';

import { useQuery } from '@tanstack/react-query';
import { placesApi } from '@/services/api/places';
import { queryKeys } from '@/lib/queryKeys';
import type { PlaceStatus } from '@/types/place';

export function usePlaces(status?: PlaceStatus) {
  return useQuery({
    queryKey: queryKeys.places(status),
    queryFn: () => placesApi.list(status),
  });
}
