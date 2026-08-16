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

  async sendMessage(accountId: string, payload: any) {
    const response = await this.post(
      API_ENDPOINT_PATH.WHATSAPP.MESSAGES.getSendMessagePath(accountId),
      payload,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response;
  }

  async syncContacts(accountId: string) {
    const response = await this.post(
      API_ENDPOINT_PATH.WHATSAPP.syncContacts(accountId),
    );

    return response;
  }
}

export const whatsappService = new WhatsAppService();
