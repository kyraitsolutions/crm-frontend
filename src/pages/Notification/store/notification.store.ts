import { create } from "zustand";
import type { TNotification } from "../types/notification.type";
import { NotificationService } from "../services/notification.service";

type TNotificationState = {
  notifications: TNotification[];
  loadingNotifications: boolean;
  fetchNotifications: (organizationId: string) => Promise<void>;
  prependNotification: (notification: TNotification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  markAllRead: boolean;
  unreadCount: () => number;
  bellCount: number;
  clearBellCount: () => void;
  clearNotifications: () => void;
};

const notificationService = new NotificationService();

const notificationId = (notification: TNotification) =>
  String((notification as any)?.id || (notification as any)?._id || "");

export const useNotificationStore = create<TNotificationState>((set, get) => ({
  notifications: [],
  bellCount: 0,
  loadingNotifications: false,
  markAllRead: false,

  fetchNotifications: async (organizationId: string) => {
    if (!organizationId || organizationId === "undefined") return;
    try {
      set({
        loadingNotifications: true,
      });

      const response =
        await notificationService.getNotifications(organizationId);

      const notifications = response?.data?.docs || [];
      const unreadFromApi = Number((response.data as any)?.unreadCount);
      const unread = Number.isFinite(unreadFromApi)
        ? unreadFromApi
        : notifications.filter((item) => !item.isRead).length;

      set({
        bellCount: unread,
        notifications,
        markAllRead: unread === 0,
      });
    } catch (error) {
      console.error("Fetch notifications error", error);
    } finally {
      set({
        loadingNotifications: false,
      });
    }
  },

  prependNotification: (notification) => {
    const id = notificationId(notification);
    set((state) => {
      const existing = state.notifications.find(
        (item) => notificationId(item) === id,
      );
      const rest = state.notifications.filter(
        (item) => notificationId(item) !== id,
      );
      const shouldBump = !existing || existing.isRead;
      return {
        notifications: [{ ...notification, id, isRead: false }, ...rest],
        bellCount: shouldBump ? state.bellCount + 1 : state.bellCount,
        markAllRead: false,
      };
    });
  },

  markAsRead: (id) => {
    void notificationService.markAsRead(id).catch(() => undefined);
    set((state) => {
      const current = state.notifications.find(
        (item) => notificationId(item) === id,
      );
      const wasUnread = current && !current.isRead;
      return {
        notifications: state.notifications.map((notification) => {
          if (notificationId(notification) === id) {
            return {
              ...notification,
              isRead: true,
            };
          }
          return notification;
        }),
        bellCount: wasUnread
          ? Math.max(0, state.bellCount - 1)
          : state.bellCount,
      };
    });
  },

  markAllAsRead: () => {
    void notificationService.markAllAsRead().catch(() => undefined);
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
      bellCount: 0,
      markAllRead: true,
    }));
  },

  unreadCount: () => {
    return get().notifications.filter((notification) => !notification.isRead)
      .length;
  },

  clearBellCount: () => {
    set({
      bellCount: 0,
    });
  },

  clearNotifications: () => {
    set({
      notifications: [],
    });
  },
}));
