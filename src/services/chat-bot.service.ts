import type { ApiResponse, ChatBotFormData, ChatbotListItem } from "@/types";
import { ApiService } from "./api.service";

export class ChatBotService extends ApiService {
  constructor() {
    super();
  }

  async getChatBotsList(
    accountId: string,
  ): Promise<ApiResponse<ChatbotListItem[]>> {
    return await this.get(`/account/${accountId}/chatbots`);
  }

  async getChatBotById(
    accountId: string,
    chabotId: string,
  ): Promise<ApiResponse<{ docs: ChatBotFormData }>> {
    return await this.get(`/account/${accountId}/chatbot/${chabotId}`);
  }

  async createChatBot(
    accountId: string,
    data: ChatBotFormData,
  ): Promise<
    ApiResponse<{
      docs: ChatbotListItem;
    }>
  > {
    return await this.post(`/account/${accountId}/chatbot`, data);
  }

  // async getChatFlow(
  //   accountId: string,
  //   chatflowId: string,
  // ): Promise<ApiResponse<ApiResponseChatBotFlowDto>> {
  //   return await this.get(`/chatflow/${accountId}/flow/${chatflowId}`);
  // }

  // async createChatFlow(
  //   accountId: string,
  //   data: any,
  // ): Promise<
  //   ApiResponse<{
  //     docs: ApiResponseChatBotFlowDto;
  //   }>
  // > {
  //   return await this.post(`/chatflow/${accountId}/create`, data);
  // }

  async updateChatBot(
    accountId: string,
    chatbotId: string,
    data: { flowId?: string; status?: boolean },
  ): Promise<
    ApiResponse<{
      docs: ChatbotListItem;
    }>
  > {
    return await this.put(`/account/${accountId}/chatbot/${chatbotId}`, data);
  }

  async deleteChatBot(
    accountId: string,
    chatbotId: string,
  ): Promise<ApiResponse<ChatbotListItem>> {
    return await this.delete(
      `account/${String(accountId)}/chatbot/${chatbotId}`,
    );
  }
}
