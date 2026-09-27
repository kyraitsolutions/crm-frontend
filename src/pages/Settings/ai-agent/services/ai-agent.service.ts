import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "@/services";
import type { ApiResponse } from "@/types";
import type {
  TAiAgentBundle,
  TAiAgentConfig,
  TAiAgentVersion,
  TAiKnowledgeSource,
  TRuntimeMessage,
  TRuntimeTestResult,
  TSkillDraft,
  TAiSkillCatalogItem,
  TAiSkillSuggestion,
} from "../types/ai-agent.type";

export class AiAgentStudioService extends ApiService {
  getAgent(accountId: string): Promise<ApiResponse<TAiAgentBundle>> {
    return this.get(API_ENDPOINT_PATH.AI_AGENT.getAgentPath(accountId));
  }

  createAgent(
    accountId: string,
    payload: {
      name: string;
      industry?: string;
      website?: string;
      timezone?: string;
      greeting?: string;
      description?: string;
      skillTypes?: string[];
      groundRules?: string[];
    },
  ): Promise<ApiResponse<TAiAgentBundle>> {
    return this.post(API_ENDPOINT_PATH.AI_AGENT.createAgentPath(accountId), payload);
  }

  updateDraft(
    accountId: string,
    payload: { name?: string; config: Partial<TAiAgentConfig> },
  ): Promise<ApiResponse<TAiAgentBundle>> {
    return this.put(API_ENDPOINT_PATH.AI_AGENT.updateDraftPath(accountId), payload);
  }

  publish(accountId: string): Promise<ApiResponse<TAiAgentBundle>> {
    return this.post(API_ENDPOINT_PATH.AI_AGENT.publishPath(accountId), {});
  }

  rollback(
    accountId: string,
    versionId: string,
  ): Promise<ApiResponse<TAiAgentBundle>> {
    return this.post(API_ENDPOINT_PATH.AI_AGENT.rollbackPath(accountId), {
      versionId,
    });
  }

  listVersions(
    accountId: string,
  ): Promise<ApiResponse<{ agent: unknown; versions: TAiAgentVersion[] }>> {
    return this.get(API_ENDPOINT_PATH.AI_AGENT.versionsPath(accountId));
  }

  listKnowledge(accountId: string): Promise<ApiResponse<TAiKnowledgeSource[]>> {
    return this.get(API_ENDPOINT_PATH.AI_AGENT.knowledgePath(accountId));
  }

  createKnowledge(
    accountId: string,
    payload: {
      type: string;
      title: string;
      content?: string;
      uri?: string;
      tags?: string[];
    },
  ): Promise<ApiResponse<TAiKnowledgeSource>> {
    return this.post(API_ENDPOINT_PATH.AI_AGENT.knowledgePath(accountId), payload, {
      timeout: 90000,
    });
  }

  updateKnowledge(
    accountId: string,
    id: string,
    payload: {
      type: string;
      title: string;
      content?: string;
      uri?: string;
      tags?: string[];
    },
  ): Promise<ApiResponse<TAiKnowledgeSource>> {
    return this.put(
      API_ENDPOINT_PATH.AI_AGENT.knowledgeItemPath(accountId, id),
      payload,
    );
  }

  removeKnowledge(accountId: string, id: string) {
    return this.delete(
      API_ENDPOINT_PATH.AI_AGENT.knowledgeItemPath(accountId, id),
    );
  }

  reindexKnowledge(accountId: string, id: string) {
    return this.post(
      API_ENDPOINT_PATH.AI_AGENT.knowledgeReindexPath(accountId, id),
      {},
      { timeout: 90000 },
    );
  }

  testRuntime(
    accountId: string,
    payload: {
      message: string;
      useDraft?: boolean;
      threadId?: string;
      selectionId?: string;
      history?: TRuntimeMessage[];
    },
  ): Promise<ApiResponse<TRuntimeTestResult>> {
    return this.post(API_ENDPOINT_PATH.AI_AGENT.runtimeTestPath(accountId), payload);
  }

  listSkillCatalog(accountId: string): Promise<
    ApiResponse<{
      catalog: TAiSkillCatalogItem[];
      suggestions: TAiSkillSuggestion[];
      icons: string[];
    }>
  > {
    return this.get(API_ENDPOINT_PATH.AI_AGENT.skillsCatalogPath(accountId));
  }

  draftSkill(
    accountId: string,
    payload: { description?: string; suggestion?: string },
  ): Promise<ApiResponse<TSkillDraft>> {
    return this.post(API_ENDPOINT_PATH.AI_AGENT.skillsDraftPath(accountId), payload);
  }

  testCustomApi(
    accountId: string,
    payload: {
      method: string;
      endpoint: string;
      headers: Record<string, string>;
      params: Record<string, string>;
      authType: string;
      authToken: string;
    },
  ): Promise<ApiResponse<{ ok: boolean; status: number; body: unknown; error: string }>> {
    return this.post(API_ENDPOINT_PATH.AI_AGENT.testToolPath(accountId), payload, {
      timeout: 20000,
    });
  }
}

export const aiAgentStudioService = new AiAgentStudioService();
