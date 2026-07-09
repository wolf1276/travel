'use client';

import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '@/services/api/notifications';
import { queryKeys } from '@/lib/queryKeys';

/** Polls for new notifications so a partner's added place shows up without a
 * refresh - there's no push/realtime channel wired up yet. */
export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: notificationsApi.list,
    refetchInterval: 20000,
    refetchOnWindowFocus: true,
  });
}
