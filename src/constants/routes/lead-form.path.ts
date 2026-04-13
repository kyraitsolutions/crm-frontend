import { ACCOUNT_PATHS } from "./account.path";
import { withAccount } from "./helper";

// ${DASHBOARD_PATH.getAccountPath(accountId)}/lead-forms/${row.id}/view

export const LEAD_FORM_ROUTES = {
  LEAD_FORM: "lead-forms",
  CREATE: "create",
  UPDATE: ":formId/update",
};

export const LEAD_FORM_PATHS = {
  ROOT: withAccount("/lead-forms"),
  getList: (accountId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/${LEAD_FORM_ROUTES.LEAD_FORM}`,
  getView: (accountId: string, formId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/${LEAD_FORM_ROUTES.LEAD_FORM}/${formId}/view`,

  getCreate: (accountId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/${LEAD_FORM_ROUTES.LEAD_FORM}/${LEAD_FORM_ROUTES.CREATE}`,
  update: (accountId: string, formId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/${LEAD_FORM_ROUTES.LEAD_FORM}/${formId}/update`,
};
