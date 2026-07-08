'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { placesApi } from '@/services/api/places';
import { queryKeys } from '@/lib/queryKeys';
import type { CreatePlaceInput } from '@/types/place';

export function useCreatePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePlaceInput) => placesApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats });
    },
  });
}
