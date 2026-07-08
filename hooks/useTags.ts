'use client';

import { useQuery } from '@tanstack/react-query';
import { tagsApi } from '@/services/api/tags';
import { queryKeys } from '@/lib/queryKeys';

export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: tagsApi.list,
    staleTime: 60 * 1000,
  });
}
