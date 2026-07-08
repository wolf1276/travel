'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { placesApi } from '@/services/api/places';
import { PLACES_PAGE_SIZE } from '@/lib/constants';
import type { PlaceStatus } from '@/types/place';

export function useInfinitePlaces(status: PlaceStatus) {
  return useInfiniteQuery({
    queryKey: ['places', status, 'infinite'],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      placesApi.listPaginated({ status, cursor: pageParam, limit: PLACES_PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
