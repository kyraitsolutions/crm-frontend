import { ACCOUNT_PATHS } from "@/constants/routes";
import { useAuthStore } from "@/stores";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const { accountId, lastSlug } = useAuthStore((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    if (accountId) {
      if (lastSlug) {
        navigate(`${ACCOUNT_PATHS.byId(accountId)}/${lastSlug}`);
        return;
      }
      navigate(ACCOUNT_PATHS.byId(accountId));
    }
  }, []);
  return <Outlet />;
};

export { DashboardLayout };
