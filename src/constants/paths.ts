// export const ROUTES = {
//   ROOT: "/",
//   DASHBOARD: "/dashboard",
//   ACCOUNT: "/account",
//   CHATBOT: "/chatbot",
// };

// export const ACCOUNT_PATHS = {
//   ROOT: `${ROUTES.DASHBOARD}/account`,
//   byId: (accountId: string) => `${ROUTES.DASHBOARD}/account/${accountId}`,
//   PARAM: `${ROUTES.DASHBOARD}/account/:accountId`,
// };

// const withAccount = (path: string) => `${ACCOUNT_PATHS.PARAM}${path}`;

// export const CHATBOT_PATHS = {
//   ROOT: withAccount("/chatbot"),
//   CREATE: "create",
//   BUILDER: withAccount("/chatbot/:chatBotId/builder"),
// };

// export const DASHBOARD_PATH = {
//   ROOT: "/dashboard",
//   ACCOUNT: "account/:account-id",
//   CHATBOT_BUILDER: "/builder",
//   CHATBOT_BUILDER_FLOW: `/builder/flow-editor`,
//   SETTINGS: "/settings",
//   getAccountPath: (accountId: string, accountName?: string) =>
//     accountName
//       ? `${DASHBOARD_PATH.ROOT}/account/${accountId}/${accountName}`
//       : `${DASHBOARD_PATH.ROOT}/account/${accountId}`,

//   getAccountPathChatbot: (accountId: string, chatbotId?: string) =>
//     `${DASHBOARD_PATH.ROOT}/account/${accountId}/chatbot/${chatbotId}`,
// };
