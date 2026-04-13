// routes/account.paths.ts

import { ROUTES } from "./base.route";

export const ACCOUNT_ROUTES = {
  ACCOUNT: "account/:accountId",
};

export const ACCOUNT_PATHS = {
  ROOT: `${ROUTES.DASHBOARD}/account`,
  PARAM: `${ROUTES.DASHBOARD}/account/:accountId`,
  byId: (accountId: string) => `${ROUTES.DASHBOARD}/account/${accountId}`,
};
