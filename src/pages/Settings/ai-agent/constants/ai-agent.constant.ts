export const AI_AGENT_TABS = [
  { key: "identity", label: "Profile" },
  { key: "voice", label: "Voice" },
  { key: "skills", label: "Skills" },
  { key: "knowledge", label: "Knowledge" },
  { key: "actions", label: "Actions" },
  { key: "settings", label: "Settings" },
] as const;

export const AI_AGENT_VOICE_PRESET = {
  FRIENDLY: "friendly",
  PROFESSIONAL: "professional",
  CONCISE: "concise",
  PLAYFUL: "playful",
} as const;

export const AI_AGENT_RESPONSE_LENGTH = {
  SHORT: "short",
  MEDIUM: "medium",
  LONG: "long",
} as const;

export const AI_KNOWLEDGE_SOURCE_TYPE = {
  TEXT: "text",
  FAQ: "faq",
  URL: "url",
  FILE: "file",
  LEGACY_WHATSAPP: "legacy_whatsapp",
} as const;

export const VOICE_PRESET_OPTIONS = [
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "concise", label: "Concise" },
  { value: "playful", label: "Playful" },
];

export const RESPONSE_LENGTH_OPTIONS = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];

export const KNOWLEDGE_TYPE_OPTIONS = [
  { value: "text", label: "Text" },
  { value: "faq", label: "FAQ" },
  { value: "url", label: "Website URL" },
];

export const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

export const SENSITIVITY_OPTIONS = [
  { value: "read_only", label: "Low — no confirmation" },
  { value: "low_risk_write", label: "Low risk write" },
  { value: "high_risk_write", label: "High risk — confirmation" },
];

export const SKILL_BLURBS: Record<string, string> = {
  appointment_booking: "Customer wants to book a visit, demo or callback.",
  lead_qualification:
    "Use this skill when a customer shows interest in purchasing your product, requests a demo, asks about pricing, or wants to know if our solution is suitable for their business.",
  handle_support:
    "Use this skill when a customer asks for help with an existing issue, reports a problem, needs technical assistance, or requests support after becoming a customer.",
  human_handoff:
    "Hand the conversation to a teammate when the customer asks for a person or confidence is low.",
};
