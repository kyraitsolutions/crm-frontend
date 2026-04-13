import { Navigate } from "react-router-dom";
import { useAccountAccessStore } from "@/stores/account-access.store";
import { hasPermission } from "@/rbac";

type Props = {
  permission: string;
  children: React.ReactNode;
};

export const RequirePermission = ({ permission, children }: Props) => {
  const { permissions } = useAccountAccessStore();

  // 🔥 handle loading state
  if (!permissions?.length) {
    return <div>Loading...</div>;
  }

  const allowed = hasPermission(permissions, permission);

  if (!allowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
