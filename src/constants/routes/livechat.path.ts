import { withAccount } from "./helper";

// ${DASHBOARD_PATH.getAccountPath(accountId)}/lead-forms/${row.id}/view

export const LIVE_CHAT_ROUTES = {
  LEADS: "leads",
  CREATE: "create",
  //   UPDATE: ":formId/update",
};

export const LIVE_CHAT_PATHS = {
  ROOT: withAccount("/live-chat"),
  //   getList: (accountId: string) =>
  //     `${ACCOUNT_PATHS.byId(accountId)}/${LEAD_FORM_ROUTES.LEAD_FORM}`,
  //   getView: (accountId: string, formId: string) =>
  //     `${ACCOUNT_PATHS.byId(accountId)}/${LEAD_FORM_ROUTES.LEAD_FORM}/${formId}/view`,
  //   getCreate: (accountId: string) =>
  //     `${ACCOUNT_PATHS.byId(accountId)}/${LEAD_FORM_ROUTES.LEAD_FORM}/${LEAD_FORM_ROUTES.CREATE}`,
  //   update: (accountId: string, formId: string) =>
  //     `${ACCOUNT_PATHS.byId(accountId)}/${LEAD_FORM_ROUTES.LEAD_FORM}/${formId}/update`,
};
