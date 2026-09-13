import { ApiService } from "@/services";
import type { ApiResponse } from "@/types";

export class EmailMarketingService extends ApiService {
  overview(accountId: string): Promise<ApiResponse<any>> {
    return this.get(`/email-marketing/${accountId}/overview`);
  }

  listCampaigns(
    accountId: string,
    params?: Record<string, string | number | undefined>,
  ): Promise<ApiResponse<any>> {
    return this.get(`/email-marketing/${accountId}/campaigns`, params);
  }

  getCampaign(accountId: string, id: string): Promise<ApiResponse<any>> {
    return this.get(`/email-marketing/${accountId}/campaigns/${id}`);
  }

  createCampaign(accountId: string, payload: unknown): Promise<ApiResponse<any>> {
    return this.post(`/email-marketing/${accountId}/campaigns`, payload);
  }

  updateCampaign(
    accountId: string,
    id: string,
    payload: unknown,
  ): Promise<ApiResponse<any>> {
    return this.patch(`/email-marketing/${accountId}/campaigns/${id}`, payload);
  }

  sendNow(accountId: string, id: string): Promise<ApiResponse<any>> {
    return this.post(`/email-marketing/${accountId}/campaigns/${id}/send`, {});
  }

  schedule(
    accountId: string,
    id: string,
    payload: { scheduledAt: string; timezone?: string },
  ): Promise<ApiResponse<any>> {
    return this.post(
      `/email-marketing/${accountId}/campaigns/${id}/schedule`,
      payload,
    );
  }

  pause(accountId: string, id: string): Promise<ApiResponse<any>> {
    return this.post(`/email-marketing/${accountId}/campaigns/${id}/pause`, {});
  }

  cancel(accountId: string, id: string): Promise<ApiResponse<any>> {
    return this.post(`/email-marketing/${accountId}/campaigns/${id}/cancel`, {});
  }

  test(accountId: string, id: string, to: string): Promise<ApiResponse<any>> {
    return this.post(`/email-marketing/${accountId}/campaigns/${id}/test`, { to });
  }

  analytics(accountId: string, id: string): Promise<ApiResponse<any>> {
    return this.get(`/email-marketing/${accountId}/campaigns/${id}/analytics`);
  }

  recipients(
    accountId: string,
    id: string,
    params?: Record<string, string | number | undefined>,
  ): Promise<ApiResponse<any>> {
    return this.get(
      `/email-marketing/${accountId}/campaigns/${id}/recipients`,
      params,
    );
  }

  previewAudience(accountId: string, audience: unknown): Promise<ApiResponse<any>> {
    return this.post(`/email-marketing/${accountId}/audiences/preview`, audience);
  }

  templates(accountId: string): Promise<ApiResponse<any>> {
    return this.get(`/email-marketing/${accountId}/templates`);
  }

  createTemplate(accountId: string, payload: unknown): Promise<ApiResponse<any>> {
    return this.post(`/email-marketing/${accountId}/templates`, payload);
  }

  duplicateTemplate(accountId: string, id: string): Promise<ApiResponse<any>> {
    return this.post(
      `/email-marketing/${accountId}/templates/${id}/duplicate`,
      {},
    );
  }

  deleteTemplate(accountId: string, id: string): Promise<ApiResponse<any>> {
    return this.delete(`/email-marketing/${accountId}/templates/${id}`);
  }

  suppression(accountId: string): Promise<ApiResponse<any>> {
    return this.get(`/email-marketing/${accountId}/suppression`);
  }

  addSuppression(
    accountId: string,
    payload: { email: string; reason?: string },
  ): Promise<ApiResponse<any>> {
    return this.post(`/email-marketing/${accountId}/suppression`, payload);
  }
}

export const emailMarketingService = new EmailMarketingService();
