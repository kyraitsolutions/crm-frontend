import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";
import { API_ENDPOINT_PATH } from "@/constants/api's-path";

export class WhatsappService extends ApiService {
  async connectWhatsapp(payload?: unknown): Promise<ApiResponse<any>> {
    return await this.post(
      API_ENDPOINT_PATH.INTEGRATION.WHATSAPP.CONNECT_WHATSAPP,
      payload ?? {},
    );
  }
}
