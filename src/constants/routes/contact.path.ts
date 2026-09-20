import { ACCOUNT_PATHS } from "./account.path";
import { withAccount } from "./helper";

export const CONTACT_ROUTES = {
  CONTACT: "contacts",
  CREATE: "create",
  IMPORTS: "imports",
  IMPORT_NEW: "imports/new",
  IMPORT_JOB: "imports/:jobId",
};

export const CONTACT_PATHS = {
  ROOT: withAccount(`/${CONTACT_ROUTES.CONTACT}`),
  IMPORTS: withAccount(`/${CONTACT_ROUTES.CONTACT}/imports`),
  IMPORT_NEW: withAccount(`/${CONTACT_ROUTES.CONTACT}/imports/new`),
  IMPORT_JOB: withAccount(`/${CONTACT_ROUTES.CONTACT}/imports/:jobId`),
  getHistory: (accountId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/${CONTACT_ROUTES.CONTACT}/imports`,
  getNew: (accountId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/${CONTACT_ROUTES.CONTACT}/imports/new`,
  getJob: (accountId: string, jobId: string) =>
    `${ACCOUNT_PATHS.byId(accountId)}/${CONTACT_ROUTES.CONTACT}/imports/${jobId}`,
};
