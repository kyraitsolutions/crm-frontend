// routes/helpers.ts

import { ACCOUNT_PATHS } from "./account.path";

export const withAccount = (path: string) => `${ACCOUNT_PATHS.PARAM}${path}`;
