import type { ActionType, TriggerType } from "../store/automation.store";

export interface TriggerOption {
  value: TriggerType;
  label: string;
  description: string;
  group: "Lead" | "Conversation" | "Contact";
}

export interface ActionOption {
  value: ActionType;
  label: string;
  description?: string;
  /** Triggers this action applies to. Empty = all */
  triggers?: TriggerType[];
}

/** Normalize API UPPER_SNAKE / mixed case → FE snake_case */
export function normalizeTriggerKey(trigger: string | null | undefined): string {
  return String(trigger || "")
    .trim()
    .replace(/[-\s]+/g, "_")
    .toLowerCase()
    .replace(/^lead_status_changed$/, "lead_stage_changed");
}

export function triggerLabel(trigger: string | null | undefined): string {
  const key = normalizeTriggerKey(trigger);
  return (
    TRIGGER_OPTIONS.find((t) => t.value === key)?.label ||
    String(trigger || "Unknown trigger")
  );
}

export const TRIGGER_OPTIONS: TriggerOption[] = [
  {
    value: "lead_created",
    label: "Lead Created",
    description: "When a new lead is created from any source",
    group: "Lead",
  },
  {
    value: "lead_stage_changed",
    label: "Lead Stage Changed",
    description: "When a lead moves to a different stage",
    group: "Lead",
  },
  {
    value: "lead_assigned",
    label: "Lead Assigned",
    description: "When a lead is assigned to a team member",
    group: "Lead",
  },
  {
    value: "conversation_created",
    label: "Conversation Created",
    description: "When a new conversation starts (chatbot, WhatsApp, etc.)",
    group: "Conversation",
  },
  {
    value: "conversation_closed",
    label: "Conversation Closed",
    description: "When a conversation status becomes closed / resolved",
    group: "Conversation",
  },
  {
    value: "contact_created",
    label: "Contact Created",
    description: "When a new contact is added to the account",
    group: "Contact",
  },
];

export const TRIGGER_CONDITIONS_FIELDS: Record<TriggerType, string[]> = {
  lead_created: ["Lead Source", "Company", "Lead Tags", "Score Level"],
  lead_stage_changed: [
    "Lead Stage",
    "Previous Stage",
    "Lead Source",
    "Assigned User",
    "Lead Tags",
    "Company",
    "Score Level",
  ],
  lead_assigned: [
    "Lead Source",
    "Lead Stage",
    "Assigned User",
    "Lead Tags",
    "Company",
  ],
  conversation_created: ["Conversation Platform", "Conversation Status"],
  conversation_closed: ["Conversation Platform", "Conversation Status"],
  contact_created: ["Contact Source", "Contact Status"],
};

export const CONDITION_OPERATORS = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not Equals" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Does not contain" },
  { value: "is_empty", label: "Is empty" },
  { value: "is_not_empty", label: "Is not empty" },
];

export const CONDITION_FIELDS_VALUES = {
  "Lead Stage": {
    type: "api",
    apiKey: "lead_stage",
  },
  "Previous Stage": {
    type: "api",
    apiKey: "lead_stage",
  },
  "Lead Stages": {
    type: "api",
    apiKey: "lead_stage",
  },
  "Lead Status": {
    type: "api",
    apiKey: "lead_stage",
  },
  "Lead Source": {
    type: "static",
    values: [
      { label: "Facebook", key: "facebook" },
      { label: "Google Ads", key: "google_ads" },
      { label: "WhatsApp", key: "whatsapp" },
      { label: "Instagram", key: "instagram" },
      { label: "Website", key: "website" },
      { label: "Webform", key: "webform" },
      { label: "Webhook", key: "webhook" },
      { label: "Chatbot", key: "chatbot" },
      { label: "Manual", key: "manual" },
      { label: "Import", key: "import" },
    ],
  },
  "Assigned User": {
    type: "api",
    apiKey: "users",
  },
  "Lead Tags": {
    type: "text",
  },
  Company: {
    type: "text",
  },
  "Score Level": {
    type: "static",
    values: [
      { label: "Low", key: "low" },
      { label: "Medium", key: "medium" },
      { label: "High", key: "high" },
    ],
  },
  "Conversation Platform": {
    type: "static",
    values: [
      { label: "Chatbot", key: "chatbot" },
      { label: "WhatsApp", key: "whatsapp" },
      { label: "Instagram", key: "instagram" },
      { label: "Facebook", key: "facebook" },
      { label: "Website", key: "website" },
    ],
  },
  "Conversation Status": {
    type: "api",
    apiKey: "conversation_status",
  },
  "Contact Source": {
    type: "static",
    values: [
      { label: "Facebook", key: "facebook" },
      { label: "Google Ads", key: "google_ads" },
      { label: "WhatsApp", key: "whatsapp" },
      { label: "Instagram", key: "instagram" },
      { label: "Website", key: "website" },
      { label: "Webform", key: "webform" },
      { label: "Webhook", key: "webhook" },
      { label: "Chatbot", key: "chatbot" },
      { label: "Manual", key: "manual" },
      { label: "Import", key: "import" },
    ],
  },
  "Contact Status": {
    type: "static",
    values: [
      { label: "Subscribed", key: "subscribed" },
      { label: "Unsubscribed", key: "unsubscribed" },
      { label: "Bounced", key: "bounced" },
    ],
  },
} as const;

const LEAD_TRIGGERS: TriggerType[] = [
  "lead_created",
  "lead_stage_changed",
  "lead_assigned",
];

export const ACTION_OPTIONS: ActionOption[] = [
  {
    value: "assign_lead_to_user",
    label: "Assign Lead To User",
    description: "Assign the lead to a teammate",
    triggers: LEAD_TRIGGERS,
  },
  {
    value: "update_lead_stage",
    label: "Update Lead Stage",
    description: "Move the lead to a specific stage",
    triggers: LEAD_TRIGGERS,
  },
  {
    value: "add_lead_tag",
    label: "Add Lead Tag",
    description: "Tag the lead for follow-up or segmentation",
    triggers: LEAD_TRIGGERS,
  },
  {
    value: "create_task",
    label: "Create Task",
    description: "Create a follow-up task on this record",
  },
  {
    value: "send_notification",
    label: "Send Notification",
    description: "Email a notification to the account inbox or owner",
  },
];

export function actionsForTrigger(trigger: TriggerType | null): ActionOption[] {
  if (!trigger) return ACTION_OPTIONS;
  return ACTION_OPTIONS.filter(
    (opt) => !opt.triggers || opt.triggers.includes(trigger),
  );
}

export const STEPS = [
  { id: 1, label: "Select Trigger" },
  { id: 2, label: "Set Condition" },
  { id: 3, label: "Choose Actions" },
  { id: 4, label: "Review & Enable" },
];
