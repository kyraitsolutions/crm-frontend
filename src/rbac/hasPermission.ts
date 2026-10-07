export const hasPermission = (
  userPermissions: string[] = [],
  permission: string | string[],
): boolean => {
  if (!userPermissions || userPermissions.length === 0) return false;

  // OWNER / SUPER ADMIN (wildcard)
  if (userPermissions.includes("*")) return true;

  const required = Array.isArray(permission) ? permission : [permission];
  return required.some((key) => userPermissions.includes(key));
};
