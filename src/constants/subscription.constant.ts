export const FEATURE = {
  ACCOUNT_MANAGEMENT: "ACCOUNT_MANAGEMENT",
  CHATBOTS: "CHATBOTS",
  WHATSAPP_MESSAGING: "WHATSAPP_MESSAGING",
  LEAD_MANAGEMENT: "LEAD_MANAGEMENT",
  WEBHOOKS: "WEBHOOKS",
  WHATSAPP_AI_AGENT: "WHATSAPP_AI_AGENT",
  EMAIL_MARKETING: "EMAIL_MARKETING",
} as const;

export type FeatureKey = (typeof FEATURE)[keyof typeof FEATURE];

export const FEATURE_LABELS: Record<string, string> = {
  ACCOUNT_MANAGEMENT: "Accounts",
  CHATBOTS: "Chatbots",
  WHATSAPP_MESSAGING: "WhatsApp Messaging",
  LEAD_MANAGEMENT: "Lead Management",
  WEBHOOKS: "Webhooks",
  WHATSAPP_AI_AGENT: "WhatsApp AI Agent",
  EMAIL_MARKETING: "Email Marketing",
};

export const BILLING_ROLES = ["OWNER", "ADMIN"];
