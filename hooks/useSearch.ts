'use client';

import { useQuery } from '@tanstack/react-query';
import { searchApi, type SearchFilters } from '@/services/api/search';
import { queryKeys } from '@/lib/queryKeys';

export function useSearch(filters: SearchFilters) {
  const isActive = Boolean(filters.q?.trim() || filters.status || filters.tag);

  return useQuery({
    queryKey: queryKeys.search(filters.q ?? '', `${filters.status ?? ''}|${filters.tag ?? ''}`),
    queryFn: () => searchApi.search(filters),
    enabled: isActive,
  });
}
