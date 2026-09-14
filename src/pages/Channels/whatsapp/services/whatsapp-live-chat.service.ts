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
}

export const whatsappLiveChatService = new WhatsAppLiveChatService();
