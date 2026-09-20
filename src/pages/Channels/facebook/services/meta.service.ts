import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "@/services";
import type {
  TFacebookInsights,
  TFacebookLead,
  TFacebookLeadForm,
  TFacebookPost,
  TMetaPaginatedResponse,
  TMetaPagination,
} from "../types/meta-page.type";

type MetaListPayload<T> = {
  docs?: T[];
  warning?: string | null;
  pagination?: Partial<TMetaPagination> & Record<string, unknown>;
};

function readMetaList<T>(
  payload: MetaListPayload<T> | undefined,
): TMetaPaginatedResponse<T> {
  const pagination = payload?.pagination;
  return {
    docs: payload?.docs ?? [],
    warning: payload?.warning ?? null,
    pagination: pagination
      ? {
          page: Number(pagination.page) || 1,
          limit: Number(pagination.limit) || 0,
          totalDocs: Number(pagination.totalDocs) || 0,
          totalPages: Number(pagination.totalPages) || 1,
          hasNextPage: Boolean(pagination.hasNextPage),
          hasPrevPage: Boolean(pagination.hasPrevPage),
        }
      : undefined,
  };
}

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
  ): Promise<TMetaPaginatedResponse<TFacebookPost>> {
    const response = await this.get<TFacebookPost>(
      API_ENDPOINT_PATH.INTEGRATION.META.POSTS(accountId),
      params,
    );

    return readMetaList<TFacebookPost>(response.data);
  }

  async getLeadForms(
    accountId: string,
    params?: { page?: number; limit?: number },
  ): Promise<TMetaPaginatedResponse<TFacebookLeadForm>> {
    const response = await this.get<TFacebookLeadForm>(
      API_ENDPOINT_PATH.INTEGRATION.META.LEAD_FORMS(accountId),
      params,
    );

    return readMetaList<TFacebookLeadForm>(response.data);
  }

  async getLeads(
    accountId: string,
    params?: { page?: number; limit?: number; search?: string },
  ): Promise<TMetaPaginatedResponse<TFacebookLead>> {
    const response = await this.get<TFacebookLead>(
      API_ENDPOINT_PATH.INTEGRATION.META.LEADS(accountId),
      params,
    );

    return readMetaList<TFacebookLead>(response.data);
  }

  async getInsights(
    accountId: string,
  ): Promise<{ doc: TFacebookInsights | null }> {
    const response = await this.get<TFacebookInsights>(
      API_ENDPOINT_PATH.INTEGRATION.META.INSIGHTS(accountId),
    );

    return {
      doc: response.data?.doc ?? null,
    };
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
