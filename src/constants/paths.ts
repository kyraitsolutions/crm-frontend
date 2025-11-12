export const DASHBOARD_PATH = {
  ROOT: "/dashboard",
  ACCOUNT: "account/:account-id",
  CHATBOT_BUILDER: "/builder",
  CHATBOT_BUILDER_FLOW: `/builder/flow-editor`,
  getAccountPath: (accountId: string, accountName?: string) =>
    accountName
      ? `${DASHBOARD_PATH.ROOT}/account/${accountId}/${accountName}`
      : `${DASHBOARD_PATH.ROOT}/account/${accountId}`,

  getAccountPathChatbot: (accountId: string, chatbotId?: string) =>
    `${DASHBOARD_PATH.ROOT}/account/${accountId}/chatbot/${chatbotId}`,
};
