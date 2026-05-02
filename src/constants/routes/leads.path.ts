import { ACCOUNT_PATHS } from "./account.path";
import { withAccount } from "./helper";

// ${DASHBOARD_PATH.getAccountPath(accountId)}/lead-forms/${row.id}/view

export const LEADS_ROUTES = {
  LEADS: "leads",
  CREATE: "create",
  //   UPDATE: ":formId/update",
};

export const LEADS_PATHS = {
  ROOT: withAccount("/leads"),
  getList: (accountId: string) =>
      `${ACCOUNT_PATHS.byId(accountId)}/${LEADS_ROUTES.LEADS}`,
  //   getView: (accountId: string, formId: string) =>
  //     `${ACCOUNT_PATHS.byId(accountId)}/${LEAD_FORM_ROUTES.LEAD_FORM}/${formId}/view`,
  //   getCreate: (accountId: string) =>
  //     `${ACCOUNT_PATHS.byId(accountId)}/${LEAD_FORM_ROUTES.LEAD_FORM}/${LEAD_FORM_ROUTES.CREATE}`,
  //   update: (accountId: string, formId: string) =>
  //     `${ACCOUNT_PATHS.byId(accountId)}/${LEAD_FORM_ROUTES.LEAD_FORM}/${formId}/update`,
};
