export interface NotificationItem {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  placeId: string | null;
  actor: { displayName: string | null; email: string } | null;
}
