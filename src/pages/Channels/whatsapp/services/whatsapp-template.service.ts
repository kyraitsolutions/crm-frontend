import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "@/services";
import type { QueryParams } from "@/types";

export class WhatsAppTemplateService extends ApiService {
  async getTemplates(
    accountId: string,
    query: { status: string } & QueryParams,
  ) {
    const queryParams = new URLSearchParams();

    if (query.search) queryParams.append("search", query.search);
    if (query.page) queryParams.append("page", query.page.toString());
    if (query.limit) queryParams.append("limit", query.limit.toString());
    if (query.status) queryParams.append("status", query.status);

    const response = await this.get(
      `${API_ENDPOINT_PATH.WHATSAPP.TEMPLATES.getTemplateListPath(accountId)}?${queryParams.toString()}`,
    );

    return response;
  }
  async create(accountId: string, payload: any) {
    const response = await this.post(
      API_ENDPOINT_PATH.WHATSAPP.TEMPLATES.getTemplateCreatePath(accountId),
      payload,
    );

    return response;
  }
}

export const whatsappTemplateService = new WhatsAppTemplateService();
