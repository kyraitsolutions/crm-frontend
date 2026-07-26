import { ACCOUNT_PATHS } from "./account.path";
import { withAccount } from "./helper";

// ${DASHBOARD_PATH.getAccountPath(accountId)}/lead-forms/${row.id}/view

export const CALL_ROUTES = {
  CALLS: "calls",
  OUTBOUND: "outbound-calls",
  BUYNUMBER:"buy-a-number",
  MYNUMBERS:"phone-numbers",
  MYNUMBERDETAILS:"details"

  //   UPDATE: ":formId/update",
};

export const CALL_PATHS = {
  ROOT: withAccount(`/${CALL_ROUTES.CALLS}`),
  getList: (accountId: string) =>
      `${ACCOUNT_PATHS.byId(accountId)}/${CALL_ROUTES.CALLS}/${CALL_ROUTES.OUTBOUND}`,
  getPurchaseNumberList: (accountId: string) =>
      `${ACCOUNT_PATHS.byId(accountId)}/${CALL_ROUTES.CALLS}/${CALL_ROUTES.BUYNUMBER}`,
  getMyNumberList: (accountId: string) =>
      `${ACCOUNT_PATHS.byId(accountId)}/${CALL_ROUTES.CALLS}/${CALL_ROUTES.MYNUMBERS}`,
  getMyNumberDetails: (accountId: string,phoneNumberId:string) =>
      `${ACCOUNT_PATHS.byId(accountId)}/${CALL_ROUTES.CALLS}/${CALL_ROUTES.MYNUMBERS}/${CALL_ROUTES.MYNUMBERDETAILS}/${phoneNumberId}`,
  //   getView: (accountId: string, formId: string) =>
  //     `${ACCOUNT_PATHS.byId(accountId)}/${LEAD_FORM_ROUTES.LEAD_FORM}/${formId}/view`,
  //   getCreate: (accountId: string) =>
  //     `${ACCOUNT_PATHS.byId(accountId)}/${LEAD_FORM_ROUTES.LEAD_FORM}/${LEAD_FORM_ROUTES.CREATE}`,
  //   update: (accountId: string, formId: string) =>
  //     `${ACCOUNT_PATHS.byId(accountId)}/${LEAD_FORM_ROUTES.LEAD_FORM}/${formId}/update`,
};
