import { useAuthStore } from "@/stores";
import { useIntegrationStore } from "@/stores/integration.store";
import { useEffect } from "react";
import WhatsappConnect from "./sections/WhatsAppConnect";
import WhatsAppWorkspace from "./sections/WhatsAppWorkspace";
import { useWhatsAppStore } from "./store/whatsapp.store";
import DataLoader from "@/components/Loader/data-loader";

export default function Whatsapp() {
  const { accountId } = useAuthStore();
  const { connect } = useWhatsAppStore();
  const { integration, getIntegration, loading } = useIntegrationStore(
    (state) => state,
  );

  const handleWhatsAppConnect = async () => {
    const data = await connect(String(accountId));

    if (data && data?.connectUrl) {
      window.open(data.connectUrl, "_blank");
    }
  };

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
      {integration?.connected ? (
        <WhatsAppWorkspace />
      ) : (
        <WhatsappConnect onConnect={handleWhatsAppConnect} />
      )}
    </main>
  );
}
