import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";

export class AnalyticsService extends ApiService {
  async getOverview(params: any): Promise<ApiResponse<any>> {
    const { accountId, ...queryParams } = params;
    return await this.get(`/account/${accountId}/overview`, queryParams);
  }
}
