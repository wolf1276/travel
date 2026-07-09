import { apiFetch } from '@/services/api/http';
import type { NotificationItem } from '@/types/notification';

export const notificationsApi = {
  list() {
    return apiFetch<{ notifications: NotificationItem[]; unreadCount: number }>('/api/notifications');
  },
  markRead(id: string) {
    return apiFetch<{ success: true }>(`/api/notifications/${id}/read`, { method: 'POST' });
  },
};
