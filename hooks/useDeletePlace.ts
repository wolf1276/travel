'use client';

import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { placesApi } from '@/services/api/places';
import { queryKeys } from '@/lib/queryKeys';
import type { PlaceListItem } from '@/types/place';

interface PaginatedPlaces {
  places: PlaceListItem[];
  nextCursor: string | null;
}

function removeFromCachedData(data: unknown, id: string): unknown {
  if (Array.isArray(data)) {
    return (data as PlaceListItem[]).filter((place) => place.id !== id);
  }
  if (data && typeof data === 'object' && 'pages' in data) {
    const infiniteData = data as InfiniteData<PaginatedPlaces>;
    return {
      ...infiniteData,
      pages: infiniteData.pages.map((page) => ({
        ...page,
        places: page.places.filter((place) => place.id !== id),
      })),
    };
  }
  return data;
}

export function useDeletePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => placesApi.remove(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['places'] });
      const snapshots = queryClient.getQueriesData({ queryKey: ['places'] });

      snapshots.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData(key, removeFromCachedData(data, id));
      });

      return { snapshots };
    },
    onError: (_error, _id, context) => {
      context?.snapshots.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats });
    },
  });
}
