export const DASHBOARD_PATH = {
  ROOT: "/dashboard",
  ACCOUNT: "account/:account-id",
  getAccountPath: (accountId: string, accountName?: string) =>
    accountName
      ? `${DASHBOARD_PATH.ROOT}/account/${accountId}/${accountName}`
      : `${DASHBOARD_PATH.ROOT}/account/${accountId}`,
};
