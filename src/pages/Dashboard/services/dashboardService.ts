import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "@/services";
import type { ApiResponse } from "@/types";

export class DashboardService extends ApiService {
  async getDashboardOverview(params: any): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();

    if (params?.module) queryParams.set("module", params.module);
    if (params?.range) queryParams.set("range", params.range);
    if (params?.startDate) queryParams.set("startDate", params.startDate);
    if (params?.endDate) queryParams.set("endDate", params.endDate);

    return await this.get(
      `${API_ENDPOINT_PATH.DASHBOARD.getDashboardOverviewPath(params.accountId)}?${queryParams.toString()}`,
    );
  }
}

export const dashboardService = new DashboardService();
