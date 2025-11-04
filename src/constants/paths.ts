export const DASHBOARD_PATH = {
  ROOT: "/dashboard",
  ACCOUNT: "account/:account-id/:account-name",
  getAccountPath: (accountId: string, accountName: string) =>
    `${DASHBOARD_PATH.ROOT}/account/${accountId}/${accountName}`,
};
