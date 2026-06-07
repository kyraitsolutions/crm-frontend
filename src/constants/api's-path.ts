export const API_PATH_PREFIX_USER = "/auth";

export const API_ENDPOINT_PATH = {
  AUTH_USER: {
    ME: `${API_PATH_PREFIX_USER}/me`,
    // CREATE: `/organization/onboarding`,
    // UPDATE: `${API_PATH_PREFIX_USER}/user/update`,
    // GET: `${API_PATH_PREFIX_USER}/user/get`,
    // DELETE: `${API_PATH_PREFIX_USER}/user/delete`,
    // ASSIGN: `${API_PATH_PREFIX_USER}/user/assign`,
    ONBOARDING: `/organization/onboarding`,
  },

  DASHBOARD: {
    // GET_DASHBOARD_OVERVIEW: "/dashboard/overview",
    getDashboardOverviewPath: (id: string) => `/account/${id}/overview`,
  },

  ORGANIZATION: {
    ONBOARDING: `/organization/onboarding`,
    getOrganizationDetailsByOrganizationIdPath: (id: string) =>
      `/organization/${id}`,
    updateOrganizationPath: (id: string) => `/organization/${id}`,
  },

  ACCOUNTS: {
    CREATE_ACCOUNT: `/account`,
    GET_ACCOUNTS: `/account`,
    getAccountByIdPath: (id: string) => `/account/${id}`,
    getAccountAccessPath: (id: string) => `/account/${id}/access`,
    deleteAccountPath: (id: string) => `/account/${id}`,
    updateAccountPath: (id: string) => `/account/${id}`,
  },

  ROLES: {
    CREATE_ROLE: "/roles",
    GET_ROLES: "/roles",
    updateRolePath: (id: string) => `/roles/${id}`,
    deleteRolePath: (id: string) => `/roles/${id}`,
    getPermissionsByRolePath: (id: string) => `/roles/${id}/permissions`,
  },

  MEDIA: {
    GET_MEDIA_UPLOAD_PRESIGNED_URL: "/media/upload/presigned-url",
  },

  CONVERSATION: {
    getConversationByIdPath: (id: string) => `/conversation/${id}`,
  },

  CONVERSATION_MESSAGES: {
    getMessageByConversationIdPath: (conversationId: string) =>
      `/message/${conversationId}`,
  },

  NOTIFICATIONS: {
    GET_NOTIFICATIONS: `/notification`,
  },

  CONFIGURATION: {
    GET_CONFIGURATION: `/configuration`,
    createConfigItemPath: (id: string) => `/configuration/${id}`,

    updateConfigItemPath: (configId: string, itemId: string) =>
      `/configuration/${configId}/${itemId}`,
    deleteConfigItemPath: (configId: string, itemId: string) =>
      `/configuration/${configId}/${itemId}`,
  },

  AUTOMATIONS: {
    GET_AUTOMATIONS: `/automation`,
    CREATE_AUTOMATION: `/automation`,
  },

  WHATSAPP: {
    CONNECT_WHATSAPP: "/whatsapp/connect",
  },
};
