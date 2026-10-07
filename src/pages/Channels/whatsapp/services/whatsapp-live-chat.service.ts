import { ApiService } from "@/services";
import type { ApiResponse } from "@/types";
import type { WhatsAppLiveChatContext, WhatsAppLiveChatSettings } from "../types/live-chat.type";

export class WhatsAppLiveChatService extends ApiService {
  getContext(accountId: string): Promise<ApiResponse<WhatsAppLiveChatContext>> {
    return this.get(`/whatsapp/account/${accountId}/live-chat/context`);
  }

  getSettings(accountId: string): Promise<ApiResponse<WhatsAppLiveChatSettings>> {
    return this.get(`/whatsapp/account/${accountId}/live-chat/settings`);
  }

  updateSettings(
    accountId: string,
    payload: Partial<WhatsAppLiveChatSettings>,
  ): Promise<ApiResponse<WhatsAppLiveChatSettings>> {
    return this.put(`/whatsapp/account/${accountId}/live-chat/settings`, payload);
  }

  resumeConversation(accountId: string, conversationId: string) {
    return this.post(
      `/whatsapp/account/${accountId}/live-chat/conversations/${conversationId}/resume`,
      {},
    );
  }

  claimIntervention(accountId: string, conversationId: string) {
    return this.post(
      `/whatsapp/account/${accountId}/live-chat/conversations/${conversationId}/intervene`,
      {},
    );
  }

  acceptIntervention(accountId: string, conversationId: string) {
    return this.post(
      `/whatsapp/account/${accountId}/live-chat/conversations/${conversationId}/intervene/accept`,
      {},
    );
  }
}

export const whatsappLiveChatService = new WhatsAppLiveChatService();
