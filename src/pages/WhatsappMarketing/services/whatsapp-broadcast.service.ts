import { ApiService } from "@/services";
import type { ApiResponse } from "@/types";

export class WhatsAppBroadcastService extends ApiService {
  context(accountId: string): Promise<ApiResponse<any>> {
    return this.get(`/whatsapp/account/${accountId}/broadcast/context`);
  }

  overview(accountId: string): Promise<ApiResponse<any>> {
    return this.get(`/whatsapp/account/${accountId}/broadcast/overview`);
  }

  templates(accountId: string): Promise<ApiResponse<any>> {
    return this.get(`/whatsapp/account/${accountId}/broadcast/templates`);
  }

  listCampaigns(
    accountId: string,
    params?: Record<string, string | number | undefined>,
  ): Promise<ApiResponse<any>> {
    return this.get(`/whatsapp/account/${accountId}/broadcast/campaigns`, params);
  }

  getCampaign(accountId: string, id: string): Promise<ApiResponse<any>> {
    return this.get(`/whatsapp/account/${accountId}/broadcast/campaigns/${id}`);
  }

  createCampaign(accountId: string, payload: unknown): Promise<ApiResponse<any>> {
    return this.post(`/whatsapp/account/${accountId}/broadcast/campaigns`, payload);
  }

  sendNow(accountId: string, id: string): Promise<ApiResponse<any>> {
    return this.post(`/whatsapp/account/${accountId}/broadcast/campaigns/${id}/send`, {});
  }

  schedule(
    accountId: string,
    id: string,
    payload: { scheduledAt: string; timezone?: string },
  ): Promise<ApiResponse<any>> {
    return this.post(
      `/whatsapp/account/${accountId}/broadcast/campaigns/${id}/schedule`,
      payload,
    );
  }

  resend(accountId: string, id: string): Promise<ApiResponse<any>> {
    return this.post(`/whatsapp/account/${accountId}/broadcast/campaigns/${id}/resend`, {});
  }

  analytics(accountId: string, id: string): Promise<ApiResponse<any>> {
    return this.get(`/whatsapp/account/${accountId}/broadcast/campaigns/${id}/analytics`);
  }

  recipients(
    accountId: string,
    id: string,
    params?: Record<string, string | number | undefined>,
  ): Promise<ApiResponse<any>> {
    return this.get(
      `/whatsapp/account/${accountId}/broadcast/campaigns/${id}/recipients`,
      params,
    );
  }

  previewAudience(accountId: string, payload: unknown): Promise<ApiResponse<any>> {
    return this.post(`/whatsapp/account/${accountId}/broadcast/audiences/preview`, payload);
  }

  test(accountId: string, payload: unknown): Promise<ApiResponse<any>> {
    return this.post(`/whatsapp/account/${accountId}/broadcast/test`, payload);
  }

  getOptIn(accountId: string): Promise<ApiResponse<any>> {
    return this.get(`/whatsapp/account/${accountId}/broadcast/optin`);
  }

  updateOptIn(accountId: string, payload: unknown): Promise<ApiResponse<any>> {
    return this.put(`/whatsapp/account/${accountId}/broadcast/optin`, payload);
  }
}

export const whatsappBroadcastService = new WhatsAppBroadcastService();
