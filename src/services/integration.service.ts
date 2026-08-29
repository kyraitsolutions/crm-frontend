import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "./api.service";

export class IntegrationService extends ApiService {
  async getIntegration({
    accountId,
    provider,
  }: {
    accountId: string;
    provider: string;
  }) {
    const response = await this.get(
      `${API_ENDPOINT_PATH.INTEGRATION.getIntegrationPath(accountId, provider)}`,
    );
    return response.data;
  }
  async connectWhatsApp(payload: any) {
    const response = await this.post(
      `${API_ENDPOINT_PATH.INTEGRATION.WHATSAPP.CONNECT_WHATSAPP}`,
      payload,
    );
    return response.data;
  }

  async disconnectWhatsApp(accountId: string, integrationId: string) {
    const response = await this.post(
      `${API_ENDPOINT_PATH.INTEGRATION.WHATSAPP.DISCONNECT_WHATSAPP}`,
      {
        accountId,
        integrationId,
      },
    );
    return response.data;
  }
}

export const integrationService = new IntegrationService();
