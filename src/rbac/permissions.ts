// src/rbac/permissions.ts

export const PERMISSION_CONFIG = [
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
    title: "CHATBOTS",
    modules: [
      {
        key: "chatbots",
        label: "Chatbots",
        actions: ["create", "edit", "delete", "view", "launch"],
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
    title: "LEAD FORM",
    modules: [
      {
        key: "leadForms",
        label: "Lead Form",
        actions: ["create", "edit", "delete", "view", "launch", "viewReport"],
      },
    ],
  },
  {
    title: "CAMPAIGNS",
    modules: [
      {
        key: "campaigns",
        label: "Campaigns",
        actions: [
          "create",
          "edit",
          "delete",
          "view",
          "export",
          "launch",
          "viewReport",
        ],
      },
    ],
  },
];

export const ALL_ACTIONS = [
  "create",
  "edit",
  "delete",
  "view",
  "export",
  // "launch",
  // "viewReport",
];

export const modules = ["accounts", "leads", "chatbots", "leadform", "teams"];

export const generateAllPermissions = () => {
  return modules.flatMap((module) =>
    ALL_ACTIONS.map((action) => `${module}:${action}`),
  );
};
