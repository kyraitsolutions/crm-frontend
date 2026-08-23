import { ACCOUNT_PATHS } from "./account.path";
import { ROUTES } from "./base.route";
import { withAccount } from "./helper";

// ${DASHBOARD_PATH.getAccountPath(accountId)}/lead-forms/${row.id}/view

export const WHATSAPP_ROUTES = {
  WHATSAPP: "whatsapp",
  PROFILE: "profile",
  TEMPLATE: "template-messages",
  CANNED: "canned-messages",
  CREATE: "create",
  //   UPDATE: ":formId/update",
};

export const WHATSAPP_PATHS = {
  ROOT: withAccount(`/${WHATSAPP_ROUTES.WHATSAPP}`),
  getTemplates: (accountId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/${WHATSAPP_ROUTES.WHATSAPP}/${WHATSAPP_ROUTES.TEMPLATE}`,
  createTemplates: () =>
    `${ROUTES.DASHBOARD}/settings/whatsapp/template-messages/create`,
  createCannedMessage: (accountId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/${WHATSAPP_ROUTES.WHATSAPP}/${WHATSAPP_ROUTES.CANNED}/${WHATSAPP_ROUTES.CREATE}`,
  //   getPurchaseNumberList: (accountId: string) =>
  //       `${ACCOUNT_PATHS.byId(accountId)}/${CALL_ROUTES.CALLS}/${CALL_ROUTES.BUYNUMBER}`,
  //   getMyNumberList: (accountId: string) =>
  //       `${ACCOUNT_PATHS.byId(accountId)}/${CALL_ROUTES.CALLS}/${CALL_ROUTES.MYNUMBERS}`,
  //   getMyNumberDetails: (accountId: string,phoneNumberId:string) =>
  //       `${ACCOUNT_PATHS.byId(accountId)}/${CALL_ROUTES.CALLS}/${CALL_ROUTES.MYNUMBERS}/${CALL_ROUTES.MYNUMBERDETAILS}/${phoneNumberId}`,
  //   getView: (accountId: string, formId: string) =>
  //     `${ACCOUNT_PATHS.byId(accountId)}/${LEAD_FORM_ROUTES.LEAD_FORM}/${formId}/view`,
  //   getCreate: (accountId: string) =>
  //     `${ACCOUNT_PATHS.byId(accountId)}/${LEAD_FORM_ROUTES.LEAD_FORM}/${LEAD_FORM_ROUTES.CREATE}`,
  //   update: (accountId: string, formId: string) =>
  //     `${ACCOUNT_PATHS.byId(accountId)}/${LEAD_FORM_ROUTES.LEAD_FORM}/${formId}/update`,
};
