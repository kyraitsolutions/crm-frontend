import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "@/services";

export class MetaService extends ApiService {
  async connect(payload: { accountId: string }) {
    const response = await this.post(
      API_ENDPOINT_PATH.INTEGRATION.META.CONNECT,
      payload,
    );

    return response.data;
  }

  async disconnect(payload: { accountId: string; integrationId: string }) {
    const response = await this.post(
      API_ENDPOINT_PATH.INTEGRATION.META.DISCONNECT,
      payload,
    );

    return response.data;
  }
}

export const metaService = new MetaService();
