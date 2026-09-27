export type TAiAgentIdentity = {
  name: string;
  website: string;
  greeting: string;
  description: string;
  industry: string;
  timezone: string;
};

export type TAiAgentVoice = {
  preset: string;
  customInstructions: string;
  responseLength: string;
  language: string;
  interactiveReplies: boolean;
};

export type TAiAgentSkillCollectField = {
  question: string;
  attribute: string;
  required: boolean;
};

export type TAiAgentSkillConfig = {
  key: string;
  type: string;
  enabled: boolean;
  name: string;
  icon?: string;
  whenToUse: string;
  instructions: string;
  config: {
    collectFields?: TAiAgentSkillCollectField[];
    connectedToolKeys?: string[];
    [key: string]: unknown;
  };
};

export type TAiSkillCatalogItem = {
  type: string;
  name: string;
  icon: string;
  whenToUse: string;
  instructions: string;
  builtIn: boolean;
};

export type TAiSkillSuggestion = {
  id: string;
  label: string;
  name: string;
  icon: string;
  whenToUse: string;
  instructions: string;
};

export type TSkillDraft = {
  name: string;
  whenToUse: string;
  instructions: string;
  icon: string;
};

export type TAiAgentToolConfig = {
  key: string;
  name: string;
  type: string;
  enabled: boolean;
  sensitivity: string;
  description: string;
  config?: Record<string, unknown>;
};

export type TCustomApiKv = { key: string; value: string };

export type TCustomApiForm = {
  key: string;
  name: string;
  description: string;
  intentGroup: string;
  sensitivity: string;
  examples: string[];
  method: string;
  endpoint: string;
  headers: TCustomApiKv[];
  params: TCustomApiKv[];
  authType: "none" | "bearer";
  authToken: string;
  imageField: string;
  replyFields: string;
};

export type TAiAgentSafety = {
  neverInventFacts: boolean;
  onHumanRequest: boolean;
  onUnknownInfo: boolean;
  onComplaint: boolean;
  onLowConfidence: boolean;
  lowConfidenceThreshold: number;
  customerHandoffMessage: string;
};

export type TAiAgentConfig = {
  identity: TAiAgentIdentity;
  groundRules: string[];
  voice: TAiAgentVoice;
  skills: TAiAgentSkillConfig[];
  tools: TAiAgentToolConfig[];
  knowledgeSourceIds: string[];
  safety: TAiAgentSafety;
  legacyWhatsApp: Record<string, unknown> | null;
};

export type TAiAgent = {
  id: string;
  name: string;
  status: string;
  activeVersionId: string | null;
  draftVersionId: string | null;
};

export type TAiAgentVersion = {
  id: string;
  version: number;
  status: string;
  config?: TAiAgentConfig;
  publishedAt?: string | null;
  createdAt?: string;
};

export type TAiAgentBundle = {
  agent: TAiAgent | null;
  draft: TAiAgentVersion | null;
  live: TAiAgentVersion | null;
};

export type TAiKnowledgeSource = {
  id: string;
  type: string;
  status: string;
  title: string;
  uri?: string;
  content?: string;
  tags?: string[];
  chunkCount?: number;
  documentCount?: number;
  progressMessage?: string;
  errorMessage?: string;
  legacyArticleId?: string | null;
};

export type TRuntimeMessage = {
  role: "user" | "assistant";
  content: string;
};

export type TAgentInteractive = {
  type?: string;
  header?: { text?: string };
  body?: { text?: string };
  footer?: { text?: string };
  action?: {
    button?: string;
    buttons?: { reply?: { id?: string; title?: string } }[];
    sections?: {
      title?: string;
      rows?: { id?: string; title?: string; description?: string }[];
    }[];
    parameters?: { display_text?: string; url?: string };
    cards?: {
      body?: { text?: string };
      header?: { image?: { link?: string } };
      action?: { parameters?: { display_text?: string; url?: string } };
    }[];
  };
};

export type TRuntimeTestResult = {
  threadId: string;
  runId: string;
  usingDraft: boolean;
  assistantMessage: string;
  interactive?: TAgentInteractive | null;
  image?: { link: string } | null;
  shouldHandoff: boolean;
  detectedIntent: string | null;
  intentConfidence: number;
  routeTaken: string | null;
  latencyMs: number;
};
