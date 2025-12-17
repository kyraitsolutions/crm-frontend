import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";

export class SubscriptionService extends ApiService {
    async getAllSubscription(): Promise<ApiResponse<any>> {
        return await this.get(`/subscription`);
    }
}