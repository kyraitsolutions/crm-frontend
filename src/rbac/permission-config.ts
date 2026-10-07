/**
 * Fallback catalog when `/roles/permissions/catalog` is unavailable.
 * Keep in sync with BE `config/permissions.ts` PERMISSION_CATALOG.
 */
export type PermissionAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "export"
  | "import"
  | "send";

export type PermissionModuleConfig = {
  key: string;
  label: string;
  description?: string;
  actions: PermissionAction[];
};

export type PermissionSectionConfig = {
  title: string;
  modules: PermissionModuleConfig[];
};

export const PERMISSION_CONFIG: PermissionSectionConfig[] = [
  {
    title: "ACCOUNTS",
    modules: [
      {
        key: "accounts",
        label: "Accounts",
        actions: ["create", "edit", "delete", "view", "export"],
      },
    ],
  },
  {
    title: "ROLES & PRIVILEGES",
    modules: [
      {
        key: "role",
        label: "Roles",
        actions: ["view", "create", "edit", "delete"],
      },
    ],
  },
  {
    title: "TEAM MANAGEMENT",
    modules: [
      {
        key: "teams",
        label: "Team Management",
        actions: ["create", "edit", "delete", "view"],
      },
    ],
  },
  {
    title: "LEADS",
    modules: [
      {
        key: "leads",
        label: "Leads",
        actions: ["create", "edit", "delete", "view", "export"],
      },
      {
        key: "leadForms",
        label: "Lead Form",
        actions: ["create", "edit", "delete", "view"],
      },
    ],
  },
  {
    title: "CONTACTS",
    modules: [
      {
        key: "contacts",
        label: "Contacts",
        actions: ["create", "view", "import"],
      },
    ],
  },
  {
    title: "CHATBOTS",
    modules: [
      {
        key: "chatbots",
        label: "Chatbots",
        actions: ["create", "edit", "delete", "view"],
      },
    ],
  },
  {
    title: "CHANNELS",
    modules: [
      {
        key: "whatsapp",
        label: "WhatsApp (settings & templates)",
        description:
          "WABA, templates, opt-in, canned, AI agent. Not marketing broadcasts.",
        actions: ["view", "create", "edit", "delete"],
      },
      {
        key: "liveChat",
        label: "Live Chat",
        actions: ["view", "edit"],
      },
      {
        key: "facebook",
        label: "Facebook",
        actions: ["view", "edit"],
      },
      {
        key: "instagram",
        label: "Instagram",
        actions: ["view", "edit"],
      },
      {
        key: "telegram",
        label: "Telegram",
        actions: ["view", "edit"],
      },
    ],
  },
  {
    title: "MARKETING",
    modules: [
      {
        key: "whatsappMarketing",
        label: "WhatsApp Marketing",
        actions: ["view", "create", "edit", "delete", "send"],
      },
      {
        key: "emailMarketing",
        label: "Email Marketing",
        actions: ["view", "create", "edit", "delete", "send"],
      },
    ],
  },
  {
    title: "WORKSPACE SETTINGS",
    modules: [
      {
        key: "organization",
        label: "Company details",
        actions: ["view", "edit"],
      },
      {
        key: "configuration",
        label: "Configuration",
        actions: ["view", "edit"],
      },
      {
        key: "activityLogs",
        label: "Activity Logs",
        actions: ["view"],
      },
      {
        key: "integrations",
        label: "Integrations / Apps",
        actions: ["view", "edit"],
      },
      {
        key: "webhooks",
        label: "Webhooks",
        actions: ["view", "edit"],
      },
      {
        key: "recycleBin",
        label: "Recycle Bin",
        actions: ["view", "edit"],
      },
      {
        key: "storage",
        label: "Storage",
        actions: ["view"],
      },
    ],
  },
];
