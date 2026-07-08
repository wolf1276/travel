import { apiFetch } from '@/services/api/http';
import type { Tag } from '@/types/place';

export const tagsApi = {
  list() {
    return apiFetch<{ tags: Tag[] }>('/api/tags').then((r) => r.tags);
  },
};
