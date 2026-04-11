import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { DASHBOARD_PATH } from "@/constants";
import { useAuthStore } from "@/stores";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const { accountId, lastSlug } = useAuthStore((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    if (accountId) {
      if (lastSlug) {
        navigate(`${DASHBOARD_PATH.getAccountPath(accountId)}/${lastSlug}`);
        return;
      }
      navigate(DASHBOARD_PATH.getAccountPath(accountId));
    }
  }, []);
  return <Outlet />;
};

export { DashboardLayout };
