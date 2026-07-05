import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "@/services";

export class ActivityLogService extends ApiService {
  async getLogs(id: string) {
    return await this.get(
      `${API_ENDPOINT_PATH.ACTIVITY_LOGS.getActivityLogsPath(id)}`,
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
