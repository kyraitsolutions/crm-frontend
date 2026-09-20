import type { ApiResponse } from "@/types";
import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "@/services";

export class ConversationService extends ApiService {
  async getConversation(params: any): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.set("page", params.page);
    if (params?.limit) queryParams.set("limit", params.limit);
    if (params?.search) queryParams.set("search", params.search);
    if (params?.platform) queryParams.set("platform", params.platform);
    if (params?.status.length > 0) queryParams.set("status", params.status);
    if (params?.tags.length > 0) queryParams.set("tags", params.tags);
    return await this.get(
      `${API_ENDPOINT_PATH.CONVERSATION.getConversationByIdPath(params.accountId)}?${queryParams.toString()}`,
    );
  }

  async deleteConversations(
    accountId: string,
    payload: { conversationIds: string[]; deleteContact?: boolean },
  ): Promise<ApiResponse<any>> {
    return await this.post(
      API_ENDPOINT_PATH.CONVERSATION.deleteConversations(accountId),
      payload,
    );
  }

  async updateConversation(
    accountId: string,
    conversationId: string,
    payload: {
      status?: string;
      tags?: { label: string; color?: string }[];
      followUps?: {
        note?: string;
        dueAt?: string | Date | null;
        completedAt?: string | Date | null;
        createdAt?: string | Date | null;
      }[];
    },
  ): Promise<ApiResponse<any>> {
    return await this.patch(
      API_ENDPOINT_PATH.CONVERSATION.updateConversation(accountId, conversationId),
      payload,
    );
  }
}

export const conversationService = new ConversationService();
