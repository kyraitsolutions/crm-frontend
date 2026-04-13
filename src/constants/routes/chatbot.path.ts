// routes/chatbot.paths.ts

import { ACCOUNT_PATHS } from "./account.path";
import { withAccount } from "./helper";

// ✅ RELATIVE (for route config)
export const CHATBOT_ROUTES = {
  CREATE: "create",
  BUILDER: ":chatBotId/builder",
  FLOW: ":chatBotId/builder/flow-editor",
  EDIT: ":chatBotId/edit",
  USERS: ":chatBotId/users",
};

// ✅ FULL PATHS (for navigation)
export const CHATBOT_PATHS = {
  ROOT: withAccount("/chatbot"),
  getList: (accountId: string) => `${ACCOUNT_PATHS.byId(accountId)}/chatbot`,
  getCreate: (accountId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/chatbot/create`,
  getDetail: (accountId: string, chatBotId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/chatbot/${chatBotId}`,
  getBuilder: (accountId: string, chatBotId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/chatbot/${chatBotId}/builder`,
  getFlow: (accountId: string, chatBotId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/chatbot/${chatBotId}/builder/flow-editor`,
  getUsers: (accountId: string, chatBotId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/chatbot/${chatBotId}/users`,
};
