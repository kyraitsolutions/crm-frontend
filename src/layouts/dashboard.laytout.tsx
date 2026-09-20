import { ACCOUNT_PATHS } from "@/constants/routes";
import { useAuthStore } from "@/stores";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const { accountId, lastSlug } = useAuthStore((state) => state);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!accountId) return;
    if (location.pathname !== "/dashboard") return;

    if (lastSlug) {
      navigate(`${ACCOUNT_PATHS.byId(accountId)}/${lastSlug}`);
      return;
    }
    navigate(ACCOUNT_PATHS.byId(accountId));
  }, [accountId, lastSlug, location.pathname, navigate]);

  return <Outlet />;
};

export { DashboardLayout };
