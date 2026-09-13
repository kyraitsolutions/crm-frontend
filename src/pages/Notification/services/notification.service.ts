import type { ApiResponse } from "@/types";

import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "@/services";
import type { TNotification } from "../types/notification.type";

export class NotificationService extends ApiService {
  async getNotifications(
    organizationId: string,
  ): Promise<ApiResponse<TNotification>> {
    return await this.get(
      `${API_ENDPOINT_PATH?.NOTIFICATIONS?.GET_NOTIFICATIONS}/${organizationId}`,
    );
  }

  async markAsRead(notificationId: string) {
    return this.patch(
      `${API_ENDPOINT_PATH.NOTIFICATIONS.GET_NOTIFICATIONS}/${notificationId}/read`,
    );
  }

  async markAllAsRead() {
    return this.post(API_ENDPOINT_PATH.NOTIFICATIONS.MARK_ALL_READ);
  }
}
