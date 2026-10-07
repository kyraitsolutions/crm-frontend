import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "@/services";

export type ActivityLogQuery = {
  page?: number;
  limit?: number;
  search?: string;
  entityType?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
};

export class ActivityLogService extends ApiService {
  async getLogs(id: string, params?: ActivityLogQuery) {
    const query = Object.fromEntries(
      Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== ""),
    );
    return await this.get(
      `${API_ENDPOINT_PATH.ACTIVITY_LOGS.getActivityLogsPath(id)}`,
      query,
    );
  }

  async getLeadLogs(accountId: string, leadId: string) {
    return this.get(
      `${API_ENDPOINT_PATH.ACTIVITY_LOGS.getActivityLogsPath(
        accountId,
      )}?entityType=lead&entityId=${leadId}`,
    );
  }
}

export const activityLogService = new ActivityLogService();
