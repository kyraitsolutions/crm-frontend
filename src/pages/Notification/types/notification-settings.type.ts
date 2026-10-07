export type NotificationChannel = "in_app" | "email";
export type EmailDigestMode = "instant" | "hourly" | "daily";
export type NotificationModule =
  | "leads"
  | "conversations"
  | "email"
  | "campaigns"
  | "team"
  | "system";

export type NotificationSource =
  | "meta_ads"
  | "google_ads"
  | "website_form"
  | "chatbot"
  | "whatsapp"
  | "instagram"
  | "manual"
  | "import"
  | "api";

export type PreferenceFilters = {
  sources?: NotificationSource[];
  assigned_to_me?: boolean;
  unassigned_only?: boolean;
  min_lead_score?: number;
};

export type CatalogEvent = {
  key: string;
  module: NotificationModule;
  label: string;
  description: string;
  defaultChannels: NotificationChannel[];
  critical: boolean;
  supportedSources: NotificationSource[];
  supportedFilters: Array<
    "sources" | "assigned_to_me" | "unassigned_only" | "min_lead_score"
  >;
  recipientStrategy: string;
  groupable: boolean;
};

export type CatalogModule = {
  module: string;
  label: string;
  events: CatalogEvent[];
};

export type NotificationCatalog = {
  modules: CatalogModule[];
  channels: NotificationChannel[];
  sources: NotificationSource[];
};

export type UserNotificationSettings = {
  organizationId: string;
  userId: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  emailMode: EmailDigestMode;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  timezone: string;
};

export type EventChannelPreference = {
  organizationId: string;
  userId: string;
  eventKey: string;
  channel: NotificationChannel;
  enabled: boolean;
  filters: PreferenceFilters;
};

export const SOURCE_LABELS: Record<NotificationSource, string> = {
  meta_ads: "Meta",
  google_ads: "Google",
  website_form: "Website",
  chatbot: "Chatbot",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  manual: "Manual",
  import: "Import",
  api: "API",
};

export function summarizeFilters(
  filters: PreferenceFilters | undefined,
  supported: CatalogEvent["supportedFilters"],
): string {
  if (!filters) return "";
  const parts: string[] = [];
  if (supported.includes("sources") && filters.sources?.length) {
    parts.push(
      filters.sources.map((s) => SOURCE_LABELS[s] || s).join(", "),
    );
  }
  if (supported.includes("assigned_to_me") && filters.assigned_to_me) {
    parts.push("assigned to me");
  }
  if (supported.includes("unassigned_only") && filters.unassigned_only) {
    parts.push("unassigned only");
  }
  if (
    supported.includes("min_lead_score") &&
    typeof filters.min_lead_score === "number"
  ) {
    parts.push(`score ≥ ${filters.min_lead_score}`);
  }
  return parts.join(" · ");
}
