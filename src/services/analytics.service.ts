import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";

export class AnalyticsService extends ApiService {
    async getOverview(
        accountId: string
    ): Promise<ApiResponse<any>> {
        return await this.get(`/account/${accountId}/overview`);
    }
    async getSearch(
        accountId: string,
        search:string
    ): Promise<ApiResponse<any>> {
        // return await this.get(`/account/${accountId}/overview`);
        return await this.get(`/account/${accountId}/search?query=${search}`,);
    }
}