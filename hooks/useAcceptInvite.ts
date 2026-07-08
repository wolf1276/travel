'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coupleApi } from '@/services/api/couple';
import { queryKeys } from '@/lib/queryKeys';

export function useAcceptInvite(token: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => coupleApi.acceptInvite(token),
    onSuccess: (couple) => {
      queryClient.setQueryData(queryKeys.couple, couple);
      router.push('/dashboard');
      router.refresh();
    },
  });
}
