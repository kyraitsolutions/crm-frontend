import { ACCOUNT_PATHS } from "./account.path";
import { withAccount } from "./helper";

export const WHATSAPP_MARKETING_ROUTES = {
  ROOT: "broadcast/whatsapp",
};

export const WHATSAPP_MARKETING_PATHS = {
  ROOT: withAccount(`/${WHATSAPP_MARKETING_ROUTES.ROOT}`),
  base: (accountId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/${WHATSAPP_MARKETING_ROUTES.ROOT}`,
  campaigns: (accountId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/${WHATSAPP_MARKETING_ROUTES.ROOT}/campaigns`,
  createCampaign: (accountId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/${WHATSAPP_MARKETING_ROUTES.ROOT}/campaigns/create`,
  campaign: (accountId: string, campaignId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/${WHATSAPP_MARKETING_ROUTES.ROOT}/campaigns/${campaignId}`,
};
