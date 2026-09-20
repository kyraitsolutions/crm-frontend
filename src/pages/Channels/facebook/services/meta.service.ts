import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "@/services";

export class MetaService extends ApiService {
  async connect(payload: { accountId: string }) {
    const response = await this.post<{
      signupUrl?: string;
      doc?: { signupUrl?: string };
    }>(API_ENDPOINT_PATH.INTEGRATION.META.CONNECT, payload);

    return response.data;
  }

  async disconnect(payload: { accountId: string; integrationId: string }) {
    const response = await this.post(
      API_ENDPOINT_PATH.INTEGRATION.META.DISCONNECT,
      payload,
    );

    return response.data;
  }

  async getPosts(
    accountId: string,
    params?: { page?: number; limit?: number },
  ) {
    const response = await this.get(
      API_ENDPOINT_PATH.INTEGRATION.META.POSTS(accountId),
      params,
    );

    return response.data;
  }

  async getLeadForms(
    accountId: string,
    params?: { page?: number; limit?: number },
  ) {
    const response = await this.get(
      API_ENDPOINT_PATH.INTEGRATION.META.LEAD_FORMS(accountId),
      params,
    );

    return response.data;
  }

  async getLeads(
    accountId: string,
    params?: { page?: number; limit?: number; search?: string },
  ) {
    const response = await this.get(
      API_ENDPOINT_PATH.INTEGRATION.META.LEADS(accountId),
      params,
    );

    return response.data;
  }

  async getInsights(accountId: string) {
    const response = await this.get(
      API_ENDPOINT_PATH.INTEGRATION.META.INSIGHTS(accountId),
    );

    return response.data;
  }

  async setActivePage(accountId: string, pageId: string) {
    const response = await this.post(
      API_ENDPOINT_PATH.INTEGRATION.META.ACTIVE_PAGE(accountId),
      { pageId },
    );

    return response.data;
  }
}

export const metaService = new MetaService();
