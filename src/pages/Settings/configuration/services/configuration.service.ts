import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "@/services";

export class ConfigurationService extends ApiService {
  async getConfigurations(params: any) {
    return await this.get(
      `${API_ENDPOINT_PATH.CONFIGURATION.GET_CONFIGURATION}`,
      params,
    );
  }
  async createConfigurationsItem(configId: string, payload: any) {
    return await this.post(
      `${API_ENDPOINT_PATH.CONFIGURATION.createConfigItemPath(configId)}`,
      payload,
    );
  }

  async updateConfigItem(configId: string, itemId: string, payload: any) {
    return await this.put(
      `${API_ENDPOINT_PATH.CONFIGURATION.updateConfigItemPath(configId, itemId)}`,
      payload,
    );
  }

  async deleteConfigurationItem(configId: string, itemId: string) {
    return await this.delete(
      `${API_ENDPOINT_PATH.CONFIGURATION.deleteConfigItemPath(configId, itemId)}`,
    );
  }
}

export const configurationService = new ConfigurationService();
