'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { placesApi } from '@/services/api/places';
import { queryKeys } from '@/lib/queryKeys';
import type { AddPhotosInput } from '@/types/place';

export function useAddPhotos(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddPhotosInput) => placesApi.addPhotos(id, input),
    onSuccess: (place) => {
      queryClient.setQueryData(queryKeys.place(id), place);
      queryClient.invalidateQueries({ queryKey: ['places'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats });
    },
  });
}
