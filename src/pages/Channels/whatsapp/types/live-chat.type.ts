export type AutoResolveMode = "flow" | "ai_agent";
export type AutoResolveSchedule = "working_hours" | "off_hours" | "always";
export type AutoReplyType = "text" | "template";

export type DaySchedule = {
  day: string;
  enabled: boolean;
  from: string;
  to: string;
};

export type WorkingHoursConfig = {
  timezone: string;
  days: DaySchedule[];
};

export type AutoReplyConfig = {
  enabled: boolean;
  type: AutoReplyType;
  text: string;
  templateId?: string | null;
  templateName?: string | null;
  language?: string | null;
};

export type AutoResolveConfig = {
  enabled: boolean;
  mode: AutoResolveMode | null;
  chatFlowId?: string | null;
  aiAgentId?: string | null;
  scheduleMode: AutoResolveSchedule;
};

export type WhatsAppLiveChatSettings = {
  id?: string;
  autoResolve: AutoResolveConfig;
  workingHours: WorkingHoursConfig;
  welcomeMessage: AutoReplyConfig;
  offHoursMessage: AutoReplyConfig;
};

export type LiveChatFlowOption = {
  id: string;
  name: string;
  status: string;
  isPublished: boolean;
};

export type LiveChatTemplateOption = {
  id: string;
  name: string;
  language: string;
  category?: string;
  status?: string;
};

export type WhatsAppLiveChatContext = {
  settings: WhatsAppLiveChatSettings;
  flows: LiveChatFlowOption[];
  templates: LiveChatTemplateOption[];
  aiAgent: {
    configured: boolean;
    id: string | null;
    available: boolean;
  };
};
