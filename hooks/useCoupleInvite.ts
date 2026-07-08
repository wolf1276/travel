'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { coupleApi } from '@/services/api/couple';
import { queryKeys } from '@/lib/queryKeys';

export function useCoupleInvite() {
  return useQuery({
    queryKey: queryKeys.coupleInvite,
    queryFn: coupleApi.getInvite,
  });
}

export function useCreateCoupleInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coupleApi.createInvite,
    onSuccess: (invite) => {
      queryClient.setQueryData(queryKeys.coupleInvite, invite);
    },
  });
}
