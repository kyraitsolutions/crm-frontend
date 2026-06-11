import type { ActionType, TriggerType } from "../store/automation.store";

export interface TriggerOption {
  value: TriggerType;
  label: string;
  description: string;
}

export interface ActionOption {
  value: ActionType;
  label: string;
}

export const TRIGGER_OPTIONS: TriggerOption[] = [
  {
    value: "lead_created",
    label: "Lead Created",
    description: "When a new lead is created",
  },
  {
    value: "lead_stage_changed",
    label: "Lead Stage Changed",
    description: "When lead stage is assigned",
  },
  {
    value: "lead_assigned",
    label: "Lead Assigned",
    description: "When a lead is assigned",
  },
  {
    value: "conversation_created",
    label: "Conversation Created",
    description: "When a conversation starts",
  },
  {
    value: "conversation_closed",
    label: "Conversation Closed",
    description: "When a conversation is closed",
  },
];

export const TRIGGER_CONDITIONS_FIELDS = {
  lead_created: ["Lead Source"],
  lead_stage_changed: ["Lead Source", "Lead Stages", "Assigned User"],
  lead_assigned: ["Lead Source", "Lead Stages", "Assigned User"],
  conversation_created: ["Conversation Status", "Channel", "Assigned Agent"],
  conversation_closed: ["Conversation Status", "Channel", "Assigned Agent"],
};

export const CONDITION_OPERATORS = [
  {
    value: "equals",
    label: "Equals",
  },
  {
    value: "not_equals",
    label: "Not Equals",
  },
];

export const CONDITION_FIELDS_VALUES = {
  "Lead Stages": {
    type: "api",
    apiKey: "lead_stage",
  },

  "Lead Source": {
    type: "static",
    values: [
      {
        label: "Facebook",
        key: "facebook",
      },
      {
        label: "Google",
        key: "google",
      },
      {
        label: "WhatsApp",
        key: "whatsapp",
      },
      {
        label: "Webhook",
        key: "webhook",
      },
    ],
  },

  "Assigned User": {
    type: "api",
    apiKey: "users",
  },

  "Conversation Status": {
    type: "api",
    apiKey: "conversation_status",
  },

  Channel: {
    type: "static",
    values: [
      {
        label: "Facebook",
        key: "facebook",
      },
      {
        label: "Google",
        key: "google",
      },
      {
        label: "WhatsApp",
        key: "whatsapp",
      },
    ],
  },
} as const;

export const ACTION_OPTIONS: ActionOption[] = [
  { value: "assign_lead_to_user", label: "Assign Lead To User" },
  { value: "create_task", label: "Create Task" },
  { value: "send_notification", label: "Send Notification" },
  // { value: "send-email", label: "Send Email" },
];

export const STEPS = [
  { id: 1, label: "Select Trigger" },
  { id: 2, label: "Set Condition" },
  { id: 3, label: "Choose Actions" },
  { id: 4, label: "Review & Enable" },
];
