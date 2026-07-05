import { ApiService } from "@/services";
import type { ApiResponse } from "@/types";

export class WebhookService extends ApiService{
    async getToken(accountId: string): Promise<ApiResponse<any>> {
        return await this.get(`/webhook/${accountId}/token`);
    }
    async generateToken(accountId: string): Promise<ApiResponse<any>> {
        return await this.post(`/webhook/${accountId}/token`);
    }
}


export const webhookService=new WebhookService();