import { withAccount } from "./helper";
import { ACCOUNT_PATHS } from "./account.path";

export const EMAIL_MARKETING_ROUTES = {
  ROOT: "email-marketing",
};

export const EMAIL_MARKETING_PATHS = {
  ROOT: withAccount(`/${EMAIL_MARKETING_ROUTES.ROOT}`),
  base: (accountId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/${EMAIL_MARKETING_ROUTES.ROOT}`,
  campaigns: (accountId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/${EMAIL_MARKETING_ROUTES.ROOT}/campaigns`,
  createCampaign: (accountId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/${EMAIL_MARKETING_ROUTES.ROOT}/campaigns/create`,
  campaign: (accountId: string, campaignId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/${EMAIL_MARKETING_ROUTES.ROOT}/campaigns/${campaignId}`,
  templates: (accountId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/${EMAIL_MARKETING_ROUTES.ROOT}/templates`,
};
