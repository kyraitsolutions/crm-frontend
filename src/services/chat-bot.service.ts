import type {
  ApiResponse,
  ApiResponseChatBotFlowDto,
  ChatBotFormData,
} from "@/types";
import { ApiService } from "./api.service";
import type { ChatBotListItem } from "@/types";

export class ChatBotService extends ApiService {
  constructor() {
    super();
  }

  async getChatBotsList(
    accountId: string
  ): Promise<ApiResponse<ChatBotListItem[]>> {
    return await this.get(`/account/${accountId}/chatbots`);
  }

  async getChatBotById(
    accountId: string,
    chabotId: string
  ): Promise<ApiResponse<{ docs: ChatBotFormData }>> {
    return await this.get(`/account/${accountId}/chatbot/${chabotId}`);
  }

  async createChatBot(
    accountId: string,
    data: ChatBotFormData
  ): Promise<
    ApiResponse<{
      docs: ChatBotListItem;
    }>
  > {
    return await this.post(`/account/${accountId}/chatbot`, data);
  }

  async getChatBotFlow(
    accountId: string,
    chabotId: string
  ): Promise<ApiResponse<ApiResponseChatBotFlowDto>> {
    return await this.get(`/account/${accountId}/chatbot/${chabotId}/flow`);
  }

  async createChatBotFlow(
    accountId: string,
    chabotId: string,
    data: any
  ): Promise<
    ApiResponse<{
      docs: ApiResponseChatBotFlowDto;
    }>
  > {
    return await this.post(`/account/${accountId}/chatbot/${chabotId}`, data);
  }

  async updateChatBot(
    accountId: string,
    chatbotId: string,
    data: { status: boolean }
  ): Promise<
    ApiResponse<{
      docs: ChatBotListItem;
    }>
  > {
    return await this.put(`/account/${accountId}/chatbot/${chatbotId}`, data);
  }

  async deleteChatBot(
    accountId: string,
    chatbotId: string
  ): Promise<ApiResponse<ChatBotListItem>> {
    return await this.delete(
      `account/${String(accountId)}/chatbot/${chatbotId}`
    );
  }
}
