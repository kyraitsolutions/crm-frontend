import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "@/services";

export type StaffAlertChannels = {
  in_app: boolean;
  email: boolean;
  whatsapp: boolean;
};

export type StaffAlertConfig = {
  organizationId: string;
  accountId: string;
  enabled: boolean;
  channels: StaffAlertChannels;
  recipientUserIds: string[];
  events: { lead_created: boolean };
  whatsapp: {
    defaultTemplateId: string | null;
    bySource: Array<{ source: string; templateId: string }>;
  };
};

/** Backend returns `{ config }` in `result`, not the list `{ docs, doc }` shape */
export type StaffAlertApiResponse = {
  data: { config: StaffAlertConfig };
  status: number;
  message?: string;
};

export class NotificationSettingsService extends ApiService {
  private mapStaffAlertResponse(res: {
    data?: unknown;
    status: number;
    message?: string;
  }): StaffAlertApiResponse {
    const payload = res?.data as { config?: StaffAlertConfig } | undefined;
    return {
      data: {
        config: payload?.config as StaffAlertConfig,
      },
      status: res.status,
      message: res.message,
    };
  }

  async getStaffAlerts(accountId: string): Promise<StaffAlertApiResponse> {
    const res = await this.get(
      `${API_ENDPOINT_PATH.NOTIFICATIONS.STAFF_ALERTS}?accountId=${encodeURIComponent(accountId)}`,
    );
    return this.mapStaffAlertResponse(res);
  }

  async updateStaffAlerts(
    payload: Partial<StaffAlertConfig> & { accountId: string },
  ): Promise<StaffAlertApiResponse> {
    const res = await this.put(
      API_ENDPOINT_PATH.NOTIFICATIONS.STAFF_ALERTS,
      payload,
    );
    return this.mapStaffAlertResponse(res);
  }

  async sendTest(accountId: string) {
    return this.post(API_ENDPOINT_PATH.NOTIFICATIONS.TEST, { accountId });
  }

  async muteEntity(payload: {
    entityType: string;
    entityId: string;
    until?: string | null;
    reason?: string | null;
  }) {
    return this.post(API_ENDPOINT_PATH.NOTIFICATIONS.MUTE, payload);
  }

  async unmuteEntity(payload: { entityType: string; entityId: string }) {
    return this.delete(API_ENDPOINT_PATH.NOTIFICATIONS.MUTE, payload);
  }
}

export const notificationSettingsService = new NotificationSettingsService();
