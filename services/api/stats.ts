import { apiFetch } from '@/services/api/http';
import type { UserStats } from '@/types/stats';

export const statsApi = {
  get() {
    return apiFetch<{ stats: UserStats }>('/api/stats').then((r) => r.stats);
  },
};
