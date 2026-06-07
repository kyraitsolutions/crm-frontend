import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "@/services";

export class AutomationService extends ApiService {
  async createAutomation({ data, accountId }: any) {
    return await this.post(
      `${API_ENDPOINT_PATH.AUTOMATIONS.CREATE_AUTOMATION}/${accountId}`,
      data,
    );
  }
}

export const automationService = new AutomationService();
