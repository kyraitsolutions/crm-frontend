import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "@/services";

export class WhatsAppService extends ApiService {
  async registerPhoneNumber(payload: { accountId: string; pin: string }) {
    const response = await this.post(
      API_ENDPOINT_PATH.WHATSAPP.REGISTER_PHONE_NUMBER,
      payload,
    );

    return response;
  }
}

export const whatsappService = new WhatsAppService();
