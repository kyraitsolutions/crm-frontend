import type { ApiResponse, ChatBotFormData } from "@/types";
import { ApiService } from "./api.service";
import type { ChatBotListItem } from "@/types";

export class ChatBotService extends ApiService {
  constructor() {
    super();
  }

  async getChatBotsList(): Promise<ApiResponse<ChatBotListItem[]>> {
    return await this.get("/chatbot/byuser");
  }

  async getChatBotById(id: string): Promise<ApiResponse<ChatBotListItem>> {
    return await this.get(`/chatbot/${id}`);
  }

  async createChatBot(
    data: ChatBotFormData
  ): Promise<ApiResponse<ChatBotListItem>> {
    return await this.post("/chatbot", data);
  }

  async updateChatBot(
    id: string,
    data: ChatBotFormData
  ): Promise<ApiResponse<ChatBotListItem>> {
    return await this.put(`/chatbot/${id}`, data);
  }
}
