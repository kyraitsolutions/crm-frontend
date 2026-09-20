import { ApiService } from "@/services";
import type { ApiResponse } from "@/types";
import type { KnowledgeArticle, WhatsAppAiAgentConfig } from "../types/ai-agent.type";

export class WhatsAppAiAgentService extends ApiService {
  private base(accountId: string) {
    return `/whatsapp/account/${accountId}/ai-agent`;
  }

  getConfig(accountId: string): Promise<ApiResponse<WhatsAppAiAgentConfig>> {
    return this.get(this.base(accountId));
  }

  updateConfig(
    accountId: string,
    payload: Partial<WhatsAppAiAgentConfig>,
  ): Promise<ApiResponse<WhatsAppAiAgentConfig>> {
    return this.put(this.base(accountId), payload);
  }

  createKnowledge(
    accountId: string,
    payload: { title: string; content: string; tags?: string[] },
  ): Promise<ApiResponse<KnowledgeArticle>> {
    return this.post(`${this.base(accountId)}/knowledge`, payload);
  }

  updateKnowledge(
    accountId: string,
    id: string,
    payload: Partial<KnowledgeArticle>,
  ): Promise<ApiResponse<KnowledgeArticle>> {
    return this.put(`${this.base(accountId)}/knowledge/${id}`, payload);
  }

  removeKnowledge(accountId: string, id: string): Promise<ApiResponse<KnowledgeArticle>> {
    return this.delete(`${this.base(accountId)}/knowledge/${id}`);
  }

  resumeConversation(accountId: string, conversationId: string) {
    return this.post(`${this.base(accountId)}/conversations/${conversationId}/resume`, {});
  }
}

export const whatsappAiAgentService = new WhatsAppAiAgentService();
