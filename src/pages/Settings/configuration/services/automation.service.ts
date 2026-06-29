import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "@/services";

export class AutomationService extends ApiService {
  async getAutomations(accountId: string) {
    return await this.get(
      `${API_ENDPOINT_PATH.AUTOMATIONS.getAutomationsPath(accountId)}`,
    );
  }
  async createAutomation({ data, accountId }: any) {
    return await this.post(
      `${API_ENDPOINT_PATH.AUTOMATIONS.createAutomationPath(accountId)}`,
      data,
    );
  }

  async updateAutomation({ data, accountId, id }: any) {
    return await this.put(
      `${API_ENDPOINT_PATH.AUTOMATIONS.updateAutomationPath(accountId, id)}`,
      data,
    );
  }

  async deleteAutomation(accountId: string, id: string) {
    return await this.delete(
      `${API_ENDPOINT_PATH.AUTOMATIONS.deleteAutomationPath(accountId, id)}`,
    );
  }
}

export const automationService = new AutomationService();
