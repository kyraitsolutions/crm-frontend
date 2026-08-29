import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/stores";
import { useIntegrationStore } from "@/stores/integration.store";
import DataLoader from "@/components/Loader/data-loader";

export const WhatsappRouteGuard = () => {
  const accountId = useAuthStore((state) => state.accountId);

  const { getIntegration, integration, loading } = useIntegrationStore(
    (state) => state,
  );

  const location = useLocation();

  useEffect(() => {
    if (!accountId) return;
    getIntegration("whatsapp", String(accountId));
  }, [accountId]);

  if (loading) {
    return <DataLoader className="h-[80vh]" />;
  }

  const isConnected = integration?.connected === true;

  const isConnectPage = location.pathname === "/dashboard/settings/whatsapp";

  // Connected user is trying to open connect page
  if (isConnected && isConnectPage) {
    return <Navigate to="/dashboard/settings/whatsapp/overview" replace />;
  }

  // Disconnected user is trying to access workspace
  if (!isConnected && !isConnectPage) {
    return <Navigate to="/dashboard/settings/whatsapp" replace />;
  }

  return <Outlet />;
};
