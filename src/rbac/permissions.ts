// src/rbac/permissions.ts
export enum PERMISSION {
  ACCOUNT_VIEW = "account:view",
  ACCOUNT_CREATE = "account:create",
  ACCOUNT_DELETE = "account:delete",
  ACCOUNT_ASSIGN = "account:assign",

  LEAD_VIEW = "lead:view",
  LEAD_CREATE = "lead:create",
  LEAD_DELETE = "lead:delete",

  TEAM_CREATE = "team:create",
  TEAM_DELETE = "team:delete",

  // USER_MANAGE = "user:manage",
}
