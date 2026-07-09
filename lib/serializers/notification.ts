import type { Notification, User } from '@prisma/client';
import type { NotificationItem } from '@/types/notification';

export type NotificationWithActor = Notification & {
  actor: Pick<User, 'displayName' | 'email'> | null;
};

export function serializeNotification(notification: NotificationWithActor): NotificationItem {
  return {
    id: notification.id,
    message: notification.message,
    isRead: notification.isRead,
    createdAt: notification.createdAt.toISOString(),
    placeId: notification.placeId,
    actor: notification.actor
      ? { displayName: notification.actor.displayName, email: notification.actor.email }
      : null,
  };
}
