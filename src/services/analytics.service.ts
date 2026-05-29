import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";

export class AnalyticsService extends ApiService {
    async getOverview(params: any): Promise<ApiResponse<any>> {
    const { accountId, ...queryParams } = params;
    return await this.get(`/account/${accountId}/overview`, queryParams);
  }
    async getSearch(
        accountId: string,
        search:string
    ): Promise<ApiResponse<any>> {
        // return await this.get(`/account/${accountId}/overview`);
        return await this.get(`/account/${accountId}/search?query=${search}`,);
    }  
}
