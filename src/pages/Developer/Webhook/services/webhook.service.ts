import { ApiService } from "@/services";
import type { ApiResponse } from "@/types";

export class WebhookService extends ApiService{
    async getToken(
        accountId: string,
        params: { page?: number; limit?: number } = {},
    ): Promise<ApiResponse<any>> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        return await this.get(`/webhook/${accountId}/token?page=${page}&limit=${limit}`);
    }
    async generateToken(
        accountId: string,
        payload: { name: string; description?: string },
    ): Promise<ApiResponse<any>> {
        return await this.post(`/webhook/${accountId}/token`, payload);
    }

    async deleteToken(accountId: string, tokenId: string): Promise<ApiResponse<any>> {
        return await this.delete(`/webhook/${accountId}/token/${tokenId}`);
    }
}


export const webhookService=new WebhookService();