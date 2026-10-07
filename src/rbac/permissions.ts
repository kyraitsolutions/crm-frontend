export const PERMISSIONS = {
  ACCOUNTS: {
    VIEW: "accounts.view",
    CREATE: "accounts.create",
    UPDATE: "accounts.edit",
    DELETE: "accounts.delete",
    EXPORT: "accounts.export",
  },
  ROLE: {
    VIEW: "role.view",
    CREATE: "role.create",
    UPDATE: "role.edit",
    DELETE: "role.delete",
  },
  TEAMS: {
    VIEW: "teams.view",
    CREATE: "teams.create",
    UPDATE: "teams.edit",
    DELETE: "teams.delete",
  },
  CHATBOTS: {
    VIEW: "chatbots.view",
    CREATE: "chatbots.create",
    UPDATE: "chatbots.edit",
    DELETE: "chatbots.delete",
  },
  LEADS: {
    VIEW: "leads.view",
    CREATE: "leads.create",
    UPDATE: "leads.edit",
    DELETE: "leads.delete",
    EXPORT: "leads.export",
  },
  LEADS_FORMS: {
    VIEW: "leadForms.view",
    CREATE: "leadForms.create",
    UPDATE: "leadForms.edit",
    DELETE: "leadForms.delete",
  },
  CONTACTS: {
    VIEW: "contacts.view",
    CREATE: "contacts.create",
    IMPORT: "contacts.import",
  },
  WHATSAPP: {
    VIEW: "whatsapp.view",
    CREATE: "whatsapp.create",
    UPDATE: "whatsapp.edit",
    DELETE: "whatsapp.delete",
  },
  LIVE_CHAT: {
    VIEW: "liveChat.view",
    UPDATE: "liveChat.edit",
  },
  FACEBOOK: {
    VIEW: "facebook.view",
    UPDATE: "facebook.edit",
  },
  INSTAGRAM: {
    VIEW: "instagram.view",
    UPDATE: "instagram.edit",
  },
  TELEGRAM: {
    VIEW: "telegram.view",
    UPDATE: "telegram.edit",
  },
  WHATSAPP_MARKETING: {
    VIEW: "whatsappMarketing.view",
    CREATE: "whatsappMarketing.create",
    UPDATE: "whatsappMarketing.edit",
    DELETE: "whatsappMarketing.delete",
    SEND: "whatsappMarketing.send",
  },
  EMAIL_MARKETING: {
    VIEW: "emailMarketing.view",
    CREATE: "emailMarketing.create",
    UPDATE: "emailMarketing.edit",
    DELETE: "emailMarketing.delete",
    SEND: "emailMarketing.send",
  },
  ORGANIZATION: {
    VIEW: "organization.view",
    UPDATE: "organization.edit",
  },
  CONFIGURATION: {
    VIEW: "configuration.view",
    UPDATE: "configuration.edit",
  },
  ACTIVITY_LOGS: {
    VIEW: "activityLogs.view",
  },
  INTEGRATIONS: {
    VIEW: "integrations.view",
    UPDATE: "integrations.edit",
  },
  WEBHOOKS: {
    VIEW: "webhooks.view",
    UPDATE: "webhooks.edit",
  },
  RECYCLE_BIN: {
    VIEW: "recycleBin.view",
    UPDATE: "recycleBin.edit",
  },
  STORAGE: {
    VIEW: "storage.view",
  },
} as const;
