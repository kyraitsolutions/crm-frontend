import type { ApiResponse, ChatBotFormData } from "@/types";
import { ApiService } from "./api.service";
import type { ChatBotListItem } from "@/types";

export class ChatBotService extends ApiService {
  constructor() {
    super();
  }

  async getChatBotsList(accountId:string): Promise<ApiResponse<ChatBotListItem[]>> {
    return await this.get(`/account/${accountId}/chatbots`);
  }

  async getChatBotById(id: string): Promise<ApiResponse<ChatBotListItem>> {
    return await this.get(`/chatbot/${id}`);
  }

  async createChatBotFlow(
    data: any,
    accountId: string
  ): Promise<ApiResponse<ChatBotListItem>> {
    return await this.post(`/chatbot/create-flow/${accountId}`, data);
  }

  async createChatBot(
    accountId: string,
    data: ChatBotFormData
  ): Promise<ApiResponse<ChatBotListItem>> {
    return await this.post(`/account/${accountId}/chatbot`, data);
  }

  async updateChatBot(
    id: string,
    data: ChatBotFormData
  ): Promise<ApiResponse<ChatBotListItem>> {
    return await this.put(`/chatbot/${id}`, data);
  }
}
