import { ROLE_PERMISSIONS } from "./role-permissions";
import { PERMISSION } from "./permissions";
import { USERROLE } from "./roles";

export function hasPermission(
  roleId: string | undefined,
  permission: PERMISSION,
): boolean {
  if (!roleId) return false;

  const permissions = ROLE_PERMISSIONS[roleId as USERROLE];
  return permissions?.includes(permission) ?? false;
}

export const isAdmin = (roleId?: string): boolean => {
  return roleId === USERROLE.ADMIN;
};
