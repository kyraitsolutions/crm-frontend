import { Navigate } from "react-router-dom";
import { useAccountAccessStore } from "@/stores/account-access.store";
import { hasPermission } from "@/rbac";
import { ToastMessageService } from "@/services";
import Loader from "@/components/Loader";

type Props = {
  /** One key, or any-of list (e.g. view OR create). */
  permission: string | string[];
  children: React.ReactNode;
};

export const RequirePermission = ({ permission, children }: Props) => {
  const toastService = new ToastMessageService();
  const { permissions } = useAccountAccessStore();


  if (!permissions?.length) {
    return <div className="flex justify-center items-center ">
      <Loader size={20}/>
    </div>;
  }

  const allowed = hasPermission(permissions, permission);

  if (!allowed) {
    toastService.error("You are not authorized to access this page");
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
