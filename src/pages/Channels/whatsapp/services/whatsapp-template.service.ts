import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "@/services";

export class WhatsAppTemplateService extends ApiService {
  async create(accountId: string, payload: any) {
    const response = await this.post(
      API_ENDPOINT_PATH.WHATSAPP.getTemplateCreatePath(accountId),
      payload,
    );

    return response;
  }
}

export const whatsappTemplateService = new WhatsAppTemplateService();
