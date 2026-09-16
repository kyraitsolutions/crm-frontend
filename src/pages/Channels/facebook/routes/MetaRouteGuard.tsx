import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/stores";
import { useIntegrationStore } from "@/stores/integration.store";
import DataLoader from "@/components/Loader/data-loader";
import { FACEBOOK_PATHS } from "@/constants/routes/facebook.path";

export const MetaRouteGuard = () => {
  const accountId = useAuthStore((state) => state.accountId);
  const { getIntegration, integration, loading } = useIntegrationStore(
    (state) => state,
  );
  const location = useLocation();

  useEffect(() => {
    if (!accountId) return;
    getIntegration("facebook", String(accountId));
  }, [accountId]);

  const isCallbackPage = location.pathname === FACEBOOK_PATHS.CALLBACK;

  if (isCallbackPage) {
    return <Outlet />;
  }

  if (loading) {
    return <DataLoader className="h-[80vh]" />;
  }

  const isConnected =
    integration?.connected === true && integration?.provider === "facebook";
  const isConnectPage = location.pathname === FACEBOOK_PATHS.ROOT;

  if (isConnected && isConnectPage) {
    return <Navigate to={FACEBOOK_PATHS.OVERVIEW} replace />;
  }

  if (!isConnected && !isConnectPage) {
    return <Navigate to={FACEBOOK_PATHS.ROOT} replace />;
  }

  return <Outlet />;
};
