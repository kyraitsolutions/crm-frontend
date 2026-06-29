import { useAuthStore } from "@/stores";
import { useIntegrationStore } from "@/stores/integration.store";
import { useEffect } from "react";
// import { useWhatsAppStore } from "../store/whatsapp.store";
import TemplatesPage from "./TemplatesPage";
import DataLoader from "@/components/Loader/data-loader";

export const Whatsapp = () => {
  const { accountId } = useAuthStore();
  // const { connect } = useWhatsAppStore();
  const { getIntegration, loading } = useIntegrationStore((state) => state);

  // const handleWhatsAppConnect = async () => {
  //   const data = await connect(String(accountId));

  //   if (data && data?.connectUrl) {
  //     window.open(data.connectUrl, "_blank");
  //   }
  // };

  const getWhatsappIntegration = async () => {
    await getIntegration("WHATSAPP", String(accountId));
  };

  useEffect(() => {
    if (!accountId) return;
    getWhatsappIntegration();
  }, [accountId]);

  if (loading) {
    return <div><DataLoader className="h-[80vh]" /></div>;
  }

  return (
    <main>
      {/* {integration?.connected ? (
        <WhatsAppWorkspace />
      ) : (
        <WhatsappConnect onConnect={handleWhatsAppConnect} />
      )} */}
      <TemplatesPage />
    </main>
  );
};
