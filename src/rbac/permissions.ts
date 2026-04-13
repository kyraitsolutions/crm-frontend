export const PERMISSIONS = {
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
  },
  LEADS_FORMS: {
    VIEW: "leadForms.view",
    CREATE: "leadForms.create",
    UPDATE: "leadForms.edit",
    DELETE: "leadForms.delete",
  },
} as const;
