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
}

export const conversationService = new ConversationService();
