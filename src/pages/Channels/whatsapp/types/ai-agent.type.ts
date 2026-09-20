export type QualificationField = {
  key: string;
  label: string;
  required: boolean;
  type: "text" | "number" | "date" | "enum";
  options?: string[];
};

export type AgentIntent = {
  key: string;
  description: string;
};

export type KnowledgeArticle = {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  status?: string;
  updatedAt?: string;
};

export type WhatsAppAiAgentConfig = {
  id?: string;
  enabled: boolean;
  instructions: string;
  businessProfile: {
    name: string;
    industry: string;
    description: string;
    timezone: string;
  };
  qualificationFields: QualificationField[];
  intents: AgentIntent[];
  scoring: {
    weights: {
      requiredFieldsFilled: number;
      highIntent: number;
      timeline: number;
      budget: number;
      engagement: number;
    };
    levels: { min: number; max: number; level: string }[];
    notifyFromLevel: string;
    convertFromLevel: string;
    convertedStage: string;
    requirePaymentConfirmation: boolean;
  };
  discount: {
    enabled: boolean;
    maximumPercent: number;
    requiresApprovalAbovePercent: number;
    type: string;
  };
  escalation: {
    onHumanRequest: boolean;
    onUnknownInfo: boolean;
    onComplaint: boolean;
    onDiscountExceeded: boolean;
    onLowConfidence: boolean;
    onQualifiedLead: boolean;
    lowConfidenceThreshold: number;
    customerMessage: string;
  };
  knowledge?: KnowledgeArticle[];
  assets?: {
    canned: { id: string; name: string; shortcut: string; type: string }[];
    templates: { id: string; name: string; language: string }[];
  };
};
