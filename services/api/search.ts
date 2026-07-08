import { apiFetch } from '@/services/api/http';
import type { PlaceListItem, PlaceStatus } from '@/types/place';

export interface SearchFilters {
  q?: string;
  status?: PlaceStatus;
  tag?: string;
}

export const searchApi = {
  search(filters: SearchFilters) {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.status) params.set('status', filters.status);
    if (filters.tag) params.set('tag', filters.tag);
    const query = params.toString();
    return apiFetch<{ places: PlaceListItem[] }>(`/api/search${query ? `?${query}` : ''}`).then(
      (r) => r.places,
    );
  },
};
