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
    // const queryParams = new URLSearchParams();
    // if (accountId) queryParams.set("accountId", accountId);

    const response = await this.post(
      `${API_ENDPOINT_PATH.INTEGRATION.WHATSAPP.CONNECT_WHATSAPP}`,
      payload,
    );
    console.log("WhatsApp Connect Response:", response.data);
    return response.data;
  }
}

export const integrationService = new IntegrationService();
