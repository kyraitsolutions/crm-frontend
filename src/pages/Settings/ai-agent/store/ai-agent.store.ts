import { create } from "zustand";
import { ToastMessageService } from "@/services";
import { mediaService } from "@/services/media.service";
import { uploadFileToS3WithPresignedUrl } from "@/utils/s3-upload.utils";
import { aiAgentStudioService } from "../services/ai-agent.service";
import type {
  TAiAgent,
  TAiAgentConfig,
  TAiAgentSkillConfig,
  TAiAgentVersion,
  TAiKnowledgeSource,
} from "../types/ai-agent.type";

const toast = new ToastMessageService();

const emptyConfig = (): TAiAgentConfig => ({
  identity: {
    name: "",
    website: "",
    greeting: "",
    description: "",
    industry: "",
    timezone: "Asia/Kolkata",
  },
  groundRules: [],
  voice: {
    preset: "professional",
    customInstructions: "",
    responseLength: "medium",
    language: "en",
    interactiveReplies: true,
  },
  skills: [],
  tools: [],
  knowledgeSourceIds: [],
  safety: {
    neverInventFacts: true,
    onHumanRequest: true,
    onUnknownInfo: true,
    onComplaint: true,
    onLowConfidence: true,
    lowConfidenceThreshold: 0.4,
    customerHandoffMessage:
      "I'm connecting you with a team member who can help from here.",
  },
  legacyWhatsApp: null,
});

const normalizeSkill = (skill: TAiAgentSkillConfig): TAiAgentSkillConfig => ({
  key: skill.key,
  type: skill.type || skill.key || "custom",
  enabled: Boolean(skill.enabled),
  name: skill.name,
  icon: skill.icon || "zap",
  whenToUse: skill.whenToUse || "",
  instructions: skill.instructions || "",
  config: {
    ...(skill.config || {}),
    collectFields: Array.isArray(skill.config?.collectFields)
      ? skill.config.collectFields
      : [],
    connectedToolKeys: Array.isArray(skill.config?.connectedToolKeys)
      ? skill.config.connectedToolKeys
      : [],
  },
});
const asConfig = (value: unknown): TAiAgentConfig => {
  const incoming = (value || {}) as Partial<TAiAgentConfig>;
  const base = emptyConfig();
  return {
    ...base,
    ...incoming,
    identity: { ...base.identity, ...incoming.identity },
    voice: { ...base.voice, ...incoming.voice },
    safety: { ...base.safety, ...incoming.safety },
    groundRules: incoming.groundRules || base.groundRules,
    skills: (incoming.skills || []).map(normalizeSkill),
    tools: (incoming.tools || []).map((tool) => ({
      ...tool,
      config: tool.config || {},
    })),
    knowledgeSourceIds: incoming.knowledgeSourceIds || [],
  };
};

interface AiAgentStudioState {
  accountId: string;
  activeTab: string;
  testOpen: boolean;
  loading: boolean;
  creating: boolean;
  saving: boolean;
  publishing: boolean;
  agent: TAiAgent | null;
  draft: TAiAgentVersion | null;
  live: TAiAgentVersion | null;
  config: TAiAgentConfig;
  versions: TAiAgentVersion[];
  knowledge: TAiKnowledgeSource[];
  knowledgeComposer: "idle" | "crawl" | "paste";
  setActiveTab: (tab: string) => void;
  setTestOpen: (open: boolean) => void;
  setKnowledgeComposer: (composer: "idle" | "crawl" | "paste") => void;
  patchConfig: (patch: Partial<TAiAgentConfig>) => void;
  load: (accountId: string) => Promise<void>;
  createAgent: (payload: {
    name: string;
    industry?: string;
    website?: string;
    timezone?: string;
    greeting?: string;
    description?: string;
    skillTypes?: string[];
    groundRules?: string[];
  }) => Promise<void>;
  saveDraft: (override?: Partial<TAiAgentConfig>) => Promise<boolean>;
  publish: () => Promise<void>;
  rollback: (versionId: string) => Promise<void>;
  loadKnowledge: () => Promise<void>;
  createKnowledge: (payload: {
    type: string;
    title: string;
    content?: string;
    uri?: string;
    tags?: string[];
  }) => Promise<void>;
  uploadKnowledge: (file: File) => Promise<void>;
  removeKnowledge: (id: string) => Promise<void>;
  reindexKnowledge: (id: string) => Promise<void>;
}

export const useAiAgentStudioStore = create<AiAgentStudioState>((set, get) => ({
  accountId: "",
  activeTab: "identity",
  testOpen: false,
  loading: false,
  creating: false,
  saving: false,
  publishing: false,
  agent: null,
  draft: null,
  live: null,
  config: emptyConfig(),
  versions: [],
  knowledge: [],
  knowledgeComposer: "idle",

  setActiveTab: (tab) => set({ activeTab: tab }),
  setTestOpen: (testOpen) => set({ testOpen }),
  setKnowledgeComposer: (knowledgeComposer) => set({ knowledgeComposer }),

  patchConfig: (patch) =>
    set((state) => ({
      config: {
        ...state.config,
        ...patch,
        identity: patch.identity
          ? { ...state.config.identity, ...patch.identity }
          : state.config.identity,
        voice: patch.voice ? { ...state.config.voice, ...patch.voice } : state.config.voice,
        safety: patch.safety
          ? { ...state.config.safety, ...patch.safety }
          : state.config.safety,
      },
    })),

  load: async (accountId) => {
    set({ loading: true, accountId });
    try {
      const agentRes = await aiAgentStudioService.getAgent(accountId);
      const bundle = agentRes.data?.doc;
      if (!bundle?.agent) {
        set({
          agent: null,
          draft: null,
          live: null,
          config: emptyConfig(),
          versions: [],
          knowledge: [],
        });
        return;
      }
      const versionsRes = await aiAgentStudioService.listVersions(accountId);
      set({
        agent: bundle.agent,
        draft: bundle.draft || null,
        live: bundle.live || null,
        config: asConfig(bundle.draft?.config),
        versions: versionsRes.data?.doc?.versions || [],
      });
      await get().loadKnowledge();
    } catch (error: any) {
      toast.error(error?.message || "Could not load AI agent");
    } finally {
      set({ loading: false });
    }
  },

  createAgent: async (payload) => {
    const { accountId } = get();
    if (!accountId) return;
    set({ creating: true });
    try {
      const response = await aiAgentStudioService.createAgent(accountId, payload);
      const bundle = response.data?.doc;
      set({
        agent: bundle?.agent || null,
        draft: bundle?.draft || null,
        live: bundle?.live || null,
        config: asConfig(bundle?.draft?.config),
        knowledge: [],
      });
      const versionsRes = await aiAgentStudioService.listVersions(accountId);
      set({ versions: versionsRes.data?.doc?.versions || [] });
      toast.success("Agent created");
    } catch (error: any) {
      toast.error(error?.message || "Could not create the agent");
    } finally {
      set({ creating: false });
    }
  },

  saveDraft: async (override) => {
    const { accountId, config } = get();
    if (!accountId) return false;
    const nextConfig = override ? { ...config, ...override } : config;
    set({ saving: true, config: nextConfig });
    try {
      const response = await aiAgentStudioService.updateDraft(accountId, {
        name: nextConfig.identity.name,
        config: nextConfig,
      });
      const bundle = response.data?.doc;
      set({
        agent: bundle?.agent || get().agent,
        draft: bundle?.draft || get().draft,
        live: bundle?.live || get().live,
        config: asConfig(bundle?.draft?.config || nextConfig),
      });
      toast.success("Draft saved");
      return true;
    } catch (error: any) {
      toast.error(error?.message || "Could not save draft");
      return false;
    } finally {
      set({ saving: false });
    }
  },

  publish: async () => {
    const { accountId } = get();
    if (!accountId) return;
    set({ publishing: true });
    try {
      const saved = await get().saveDraft();
      if (!saved) return;
      const response = await aiAgentStudioService.publish(accountId);
      const bundle = response.data?.doc;
      set({
        agent: bundle?.agent || get().agent,
        draft: bundle?.draft || get().draft,
        live: bundle?.live || get().live,
        config: asConfig(bundle?.draft?.config || get().config),
      });
      const versions = await aiAgentStudioService.listVersions(accountId);
      set({ versions: versions.data?.doc?.versions || [] });
      toast.success("Agent published");
    } catch (error: any) {
      toast.error(error?.message || "Could not publish agent");
    } finally {
      set({ publishing: false });
    }
  },

  rollback: async (versionId) => {
    const { accountId } = get();
    if (!accountId) return;
    try {
      const response = await aiAgentStudioService.rollback(accountId, versionId);
      const bundle = response.data?.doc;
      set({
        agent: bundle?.agent || get().agent,
        draft: bundle?.draft || get().draft,
        live: bundle?.live || get().live,
        config: asConfig(bundle?.draft?.config || get().config),
      });
      toast.success("Version restored into draft");
    } catch (error: any) {
      toast.error(error?.message || "Could not restore version");
    }
  },

  loadKnowledge: async () => {
    const { accountId } = get();
    if (!accountId) return;
    try {
      const response = await aiAgentStudioService.listKnowledge(accountId);
      const doc = response.data?.doc;
      set({ knowledge: Array.isArray(doc) ? doc : [] });
    } catch (error: any) {
      toast.error(error?.message || "Could not load knowledge");
    }
  },

  createKnowledge: async (payload) => {
    const { accountId } = get();
    if (!accountId) return;
    const response = await aiAgentStudioService.createKnowledge(accountId, payload);
    const created = response.data?.doc;
    if (created?.id) {
      set((state) => ({
        knowledge: [created, ...state.knowledge.filter((item) => item.id !== created.id)],
      }));
    }
    const saved = created;
    if (saved?.status === "failed") {
      toast.error(saved.errorMessage || "We couldn't finish processing this knowledge source. Please try again.");
    } else if (saved?.status === "ready") {
      toast.success("Knowledge ready");
    } else {
      toast.success(saved?.progressMessage || "Preparing your knowledge...");
    }
    if (created?.id && saved?.status !== "failed") {
      const knowledgeSourceIds = Array.from(
        new Set([...(get().config.knowledgeSourceIds || []), created.id]),
      );
      set((state) => ({
        config: { ...state.config, knowledgeSourceIds },
      }));
      await get().saveDraft({ knowledgeSourceIds });
    }
  },

  removeKnowledge: async (id) => {
    const { accountId } = get();
    if (!accountId) return;
    await aiAgentStudioService.removeKnowledge(accountId, id);
    const knowledgeSourceIds = (get().config.knowledgeSourceIds || []).filter(
      (item) => item !== id,
    );
    set((state) => ({
      config: { ...state.config, knowledgeSourceIds },
    }));
    toast.success("Knowledge source removed");
    set((state) => ({
      knowledge: state.knowledge.filter((item) => item.id !== id),
    }));
    await get().saveDraft({ knowledgeSourceIds });
  },

  reindexKnowledge: async (id) => {
    const { accountId } = get();
    if (!accountId) return;
    const response = await aiAgentStudioService.reindexKnowledge(accountId, id);
    const doc = response.data?.doc;
    if (doc?.id) {
      set((state) => ({
        knowledge: state.knowledge.map((item) => (item.id === doc.id ? doc : item)),
      }));
    }
    const saved = doc;
    if (saved?.status === "failed") {
      toast.error(saved.errorMessage || "Reindex failed");
      return;
    }
    if (saved?.status === "ready") toast.success("Knowledge ready");
    else toast.success(saved?.progressMessage || "Preparing your knowledge...");
  },

  uploadKnowledge: async (file) => {
    const isPdf =
      file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
    if (!isPdf) {
      toast.error("This file type isn't supported yet. Please upload a PDF.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error("This file is too large. Please upload a file under 15 MB.");
      return;
    }
    const response = await mediaService.getMediaUploadPresignedUrl({
      fileName: file.name,
      mimeType: file.type || "application/pdf",
      fileSize: file.size,
    });
    const uploaded = response.data?.doc;
    if (!uploaded?.uploadUrl || !uploaded?.fileUrl) {
      throw new Error("Could not upload file");
    }
    await uploadFileToS3WithPresignedUrl(uploaded.uploadUrl, file);
    const title =
      file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() || file.name;
    await get().createKnowledge({
      type: "file",
      title,
      uri: uploaded.fileUrl,
    });
  },
}));
