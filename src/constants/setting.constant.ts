import { PERMISSIONS } from "@/rbac";

export type SettingItem = {
  label: string;
  link: string;
  /** If set, tile + route require this permission (or any of the list). */
  permission?: string | string[];
};

export type SettingSection = {
  title: string;
  items: SettingItem[];
};

export const settingSections: SettingSection[] = [
  {
    title: "General",
    items: [
      { label: "Profile", link: "/profile" },
      {
        label: "Company Details",
        link: "/company-details",
        permission: PERMISSIONS.ORGANIZATION.VIEW,
      },
      { label: "Team alerts", link: "/notifications" },
    ],
  },
  {
    title: "Users & Control",
    items: [
      {
        label: "Manage Users",
        link: "/users",
        permission: PERMISSIONS.TEAMS.VIEW,
      },
      {
        label: "Roles and Privileges",
        link: "/roles",
        permission: PERMISSIONS.ROLE.VIEW,
      },
      {
        label: "Accounts & Workspaces",
        link: "/workspace",
        permission: PERMISSIONS.ACCOUNTS.VIEW,
      },
    ],
  },
  {
    title: "Channels",
    items: [
      {
        label: "Whatsapp",
        link: "/whatsapp",
        permission: PERMISSIONS.WHATSAPP.VIEW,
      },
      {
        label: "Telegram",
        link: "/telegram",
        permission: PERMISSIONS.TELEGRAM.VIEW,
      },
      {
        label: "Instagram",
        link: "/instagram",
        permission: PERMISSIONS.INSTAGRAM.VIEW,
      },
      {
        label: "Facebook",
        link: "/facebook",
        permission: PERMISSIONS.FACEBOOK.VIEW,
      },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        label: "Configuration",
        link: "/configuration",
        permission: PERMISSIONS.CONFIGURATION.VIEW,
      },
      {
        label: "Activity Logs",
        link: "/activity-logs",
        permission: PERMISSIONS.ACTIVITY_LOGS.VIEW,
      },
    ],
  },
  {
    title: "Bot",
    items: [
      {
        label: "Chat Bot",
        link: "/chatbot",
        permission: PERMISSIONS.CHATBOTS.VIEW,
      },
      {
        label: "Chat Flows",
        link: "/chatflows",
        permission: PERMISSIONS.CHATBOTS.VIEW,
      },
      {
        label: "AI Agent",
        link: "/ai-agent",
        permission: PERMISSIONS.WHATSAPP.VIEW,
      },
    ],
  },
  {
    title: "Integration",
    items: [
      {
        label: "Apps",
        link: "/integrations",
        permission: PERMISSIONS.INTEGRATIONS.VIEW,
      },
      {
        label: "Marketplace",
        link: "/marketplace",
        permission: PERMISSIONS.INTEGRATIONS.VIEW,
      },
    ],
  },
  {
    title: "Developer Space",
    items: [
      { label: "APIs", link: "https://api.kyraitsolutions.com/docs" },
      {
        label: "Webhook",
        link: "/webhook",
        permission: PERMISSIONS.WEBHOOKS.VIEW,
      },
    ],
  },
  {
    title: "Data Administration",
    items: [
      {
        label: "Storage",
        link: "/storage",
        permission: PERMISSIONS.STORAGE.VIEW,
      },
      {
        label: "Recycle Bin",
        link: "/recyclebin",
        permission: PERMISSIONS.RECYCLE_BIN.VIEW,
      },
    ],
  },
  {
    title: "Plan & Subscription",
    items: [
      { label: "My plan", link: "/my-plan" },
      { label: "Upgrade plan", link: "/subscription" },
    ],
  },
];
