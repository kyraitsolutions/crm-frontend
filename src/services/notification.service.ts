import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";
import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import type { INotification } from "@/components/Notification/Notification";


export class NotificationService extends ApiService {

  async getNotifications(organizationId:string): Promise<ApiResponse<INotification>> {
    console.log("Org id in functiion",organizationId)
    return await this.get(`${API_ENDPOINT_PATH?.NOTIFICATIONS?.GET_NOTIFICATIONS}/${organizationId}`);
  }
};