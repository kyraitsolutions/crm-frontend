export const hasPermission = (
  userPermissions: string[] = [],
  permission: string,
): boolean => {
  if (!userPermissions || userPermissions.length === 0) return false;

  // ✅ OWNER / SUPER ADMIN (wildcard)
  if (userPermissions.includes("*")) return true;

  return userPermissions.includes(permission);
};
