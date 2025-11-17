import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

class NotificationStore {
  private notifications = new BehaviorSubject<Notification[]>([]);

  getNotifications() {
    return this.notifications.asObservable();
  }

  getCurrentNotifications() {
    return this.notifications.getValue();
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false
    };
    
    const updated = [newNotification, ...this.notifications.getValue()];
    this.notifications.next(updated);
  }

  markAsRead(id: string) {
    const updated = this.notifications.getValue().map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    this.notifications.next(updated);
  }

  markAllAsRead() {
    const updated = this.notifications.getValue().map(notif => ({ ...notif, read: true }));
    this.notifications.next(updated);
  }

  deleteNotification(id: string) {
    const updated = this.notifications.getValue().filter(notif => notif.id !== id);
    this.notifications.next(updated);
  }

  clearAll() {
    this.notifications.next([]);
  }

  getUnreadCount() {
    return this.notifications.getValue().filter(notif => !notif.read).length;
  }
}

export const notificationStore = new NotificationStore();
