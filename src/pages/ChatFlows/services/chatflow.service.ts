import { ApiService } from "@/services";
import type { ApiResponse, ApiResponseChatFlowDto } from "@/types";

class ChatflowServie extends ApiService {
  constructor() {
    super();
  }
  async getAllChatFlow(
    accountId: string,
  ): Promise<ApiResponse<ApiResponseChatFlowDto>> {
    return await this.get(`/chatflow/${accountId}`);
  }
  async getChatFlow(
    accountId: string,
    chatflowId: string,
  ): Promise<ApiResponse<ApiResponseChatFlowDto>> {
    return await this.get(`/chatflow/${accountId}/flow/${chatflowId}`);
  }
  async createChatFlow(
    accountId: string,
    data: any,
  ): Promise<ApiResponse<ApiResponseChatFlowDto>> {
    return await this.post(`/chatflow/${accountId}/create`, data);
  }

  async updateChatFlow(
    chatflowId: string,
    data: any,
  ): Promise<ApiResponse<ApiResponseChatFlowDto>> {
    return await this.put(`/chatflow/${chatflowId}`, data);
  }

  async deleteChatFlow(chatflowId: string): Promise<ApiResponse<any>> {
    return await this.delete(`/chatflow/${chatflowId}`);
  }
}

export const chatflowService = new ChatflowServie();
