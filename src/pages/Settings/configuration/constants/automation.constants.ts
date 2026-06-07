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
    value: "lead-created",
    label: "Lead Created",
    description: "When a new lead is created",
  },
  {
    value: "lead-status-changed",
    label: "Lead Status Changed",
    description: "When lead status is assigned",
  },
  {
    value: "lead-assigned",
    label: "Lead Assigned",
    description: "When a lead is assigned",
  },
  {
    value: "conversation-created",
    label: "Conversation Created",
    description: "When a conversation starts",
  },
  {
    value: "conversation-closed",
    label: "Conversation Closed",
    description: "When a conversation is closed",
  },
];

export const TRIGGER_CONDITIONS_FIELDS = {
  "lead-created": ["Lead Source"],
  "lead-status-changed": ["Lead Status", "Lead Source", "Assigned User"],
  "lead-assigned": ["Lead Status", "Lead Source", "Assigned User"],
  "conversation-created": ["Conversation Status", "Channel", "Assigned Agent"],
  "conversation-closed": ["Conversation Status", "Channel", "Assigned Agent"],
};

export const CONDITION_OPERATORS = ["Is Equal To", "Is Not Equal To"];

export const CONDITION_FIELDS_VALUES = {
  "Lead Status": {
    type: "api",
    apiKey: "lead-status",
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
    ],
  },

  "Assigned User": {
    type: "api",
    apiKey: "users",
  },

  "Conversation Status": {
    type: "api",
    apiKey: "conversation-status",
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
  { value: "assign-lead-to-user", label: "Assign Lead To User" },
  { value: "create-task", label: "Create Task" },
  { value: "send-notification", label: "Send Notification" },
  // { value: "send-email", label: "Send Email" },
];

export const STEPS = [
  { id: 1, label: "Select Trigger" },
  { id: 2, label: "Set Condition" },
  { id: 3, label: "Choose Actions" },
  { id: 4, label: "Review & Enable" },
];
