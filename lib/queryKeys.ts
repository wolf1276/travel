import type { PlaceStatus } from '@/types/place';

export const queryKeys = {
  places: (status?: PlaceStatus) => ['places', status ?? 'all'] as const,
  place: (id: string) => ['places', 'detail', id] as const,
  tags: ['tags'] as const,
  stats: ['stats'] as const,
  search: (query: string, filters: string) => ['search', query, filters] as const,
  couple: ['couple'] as const,
  coupleInvite: ['couple', 'invite'] as const,
  notifications: ['notifications'] as const,
};
