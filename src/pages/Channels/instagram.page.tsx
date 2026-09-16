import DataLoader from "@/components/Loader/data-loader";
import { FACEBOOK_PATHS } from "@/constants/routes/facebook.path";
import { useAuthStore } from "@/stores";
import { useIntegrationStore } from "@/stores/integration.store";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import Facebook from "./facebook/pages/FacebookPage";

const Instagram = () => {
  const accountId = useAuthStore((state) => state.accountId);
  const { getIntegration, integration, loading } = useIntegrationStore(
    (state) => state,
  );

  useEffect(() => {
    if (!accountId) return;
    getIntegration("instagram", String(accountId));
  }, [accountId]);

  if (loading) {
    return <DataLoader className="h-[80vh]" />;
  }

  if (integration?.connected) {
    return <Navigate to={FACEBOOK_PATHS.OVERVIEW} replace />;
  }

  return <Facebook />;
};

export default Instagram;
