'use client';

import { useQuery } from '@tanstack/react-query';
import { coupleApi } from '@/services/api/couple';
import { queryKeys } from '@/lib/queryKeys';

export function useCouple() {
  return useQuery({
    queryKey: queryKeys.couple,
    queryFn: coupleApi.get,
  });
}
