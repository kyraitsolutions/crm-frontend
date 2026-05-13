// stores/notification.store.ts

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

export const useNotificationStore = create<TNotificationState>((set, get) => ({
  notifications: [],
  bellCount: 0,
  loadingNotifications: false,
  markAllRead: false,

  fetchNotifications: async (organizationId: string) => {
    try {
      set({
        loadingNotifications: true,
      });

      const response =
        await notificationService.getNotifications(organizationId);

      const notifications = response?.data?.docs || [];

      set({
        bellCount: 0,
        notifications,
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
    set((state) => ({
      notifications: [notification, ...state.notifications],
      bellCount: state.bellCount + 1,
      markAllRead: false,
    }));
  },

  markAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map((notification) => {
        if (notification.id === notificationId) {
          return {
            ...notification,
            isRead: true,
          };
        }

        return notification;
      }),
    }));
  },

  markAllAsRead: () => {
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
