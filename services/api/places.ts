import { apiFetch } from '@/services/api/http';
import type {
  AddPhotosInput,
  CreatePlaceInput,
  MarkAsVisitedInput,
  PlaceDetail,
  PlaceListItem,
  PlaceStatus,
  UpdatePlaceInput,
} from '@/types/place';

export const placesApi = {
  list(status?: PlaceStatus) {
    const query = status ? `?status=${status}` : '';
    return apiFetch<{ places: PlaceListItem[] }>(`/api/places${query}`).then((r) => r.places);
  },
  listPaginated({ status, cursor, limit }: { status?: PlaceStatus; cursor?: string; limit: number }) {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (cursor) params.set('cursor', cursor);
    params.set('limit', String(limit));
    return apiFetch<{ places: PlaceListItem[]; nextCursor: string | null }>(
      `/api/places?${params.toString()}`,
    );
  },
  get(id: string) {
    return apiFetch<{ place: PlaceDetail }>(`/api/places/${id}`).then((r) => r.place);
  },
  create(input: CreatePlaceInput) {
    return apiFetch<{ place: PlaceListItem }>('/api/places', {
      method: 'POST',
      body: JSON.stringify(input),
    }).then((r) => r.place);
  },
  update(id: string, input: UpdatePlaceInput) {
    return apiFetch<{ place: PlaceDetail }>(`/api/places/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }).then((r) => r.place);
  },
  remove(id: string) {
    return apiFetch<{ success: true }>(`/api/places/${id}`, { method: 'DELETE' });
  },
  markAsVisited(id: string, input: MarkAsVisitedInput) {
    return apiFetch<{ place: PlaceDetail }>(`/api/places/${id}/visit`, {
      method: 'POST',
      body: JSON.stringify(input),
    }).then((r) => r.place);
  },
  addPhotos(id: string, input: AddPhotosInput) {
    return apiFetch<{ place: PlaceDetail }>(`/api/places/${id}/photos`, {
      method: 'POST',
      body: JSON.stringify(input),
    }).then((r) => r.place);
  },
};
