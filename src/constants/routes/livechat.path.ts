import { ACCOUNT_PATHS } from "./account.path";
import { withAccount } from "./helper";

export const LIVE_CHAT_ROUTES = {
  INBOX: "live-chat",
};

export const LIVE_CHAT_PATHS = {
  ROOT: withAccount("/live-chat"),
  getInbox: (
    accountId: string,
    channel?: "whatsapp" | "chatbot" | "instagram",
  ) => {
    const base = `${ACCOUNT_PATHS.byId(accountId)}/live-chat`;
    return channel ? `${base}?channel=${channel}` : base;
  },
};
