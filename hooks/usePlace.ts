'use client';

import { useQuery } from '@tanstack/react-query';
import { placesApi } from '@/services/api/places';
import { queryKeys } from '@/lib/queryKeys';

export function usePlace(id: string) {
  return useQuery({
    queryKey: queryKeys.place(id),
    queryFn: () => placesApi.get(id),
    enabled: Boolean(id),
  });
}
