import { useAuthStore } from "@/stores";
import { useIntegrationStore } from "@/stores/integration.store";
import { useEffect } from "react";
import { useWhatsAppStore } from "../store/whatsapp.store";
// import TemplatesPage from "./TemplatesPage";
import DataLoader from "@/components/Loader/data-loader";
import WhatsAppWorkspace from "../sections/WhatsAppWorkspace";
import WhatsappConnect from "../sections/WhatsAppConnect";
import TemplatesPage from "./TemplatesPage";

export const Whatsapp = () => {
  const { accountId } = useAuthStore();
  const { connect } = useWhatsAppStore();
  const { getIntegration, integration, loading } = useIntegrationStore(
    (state) => state,
  );

  const handleWhatsAppConnect = async () => {
    const data = await connect(String(accountId));

    if (data && data?.connectUrl) {
      window.open(data.connectUrl, "_blank");
    }
  };

  // const handleWhatsAppConnect = async () => {
  //   window.FB.login(
  //     (response: any) => {
  //       if (!response.authResponse) return;

  //       const code = response.authResponse.code;
  //       console.log(code);

  //       // call backend
  //       // await connect(code, accountId);
  //     },
  //     {
  //       config_id: "887392707164005",
  //       response_type: "code",
  //       override_default_response_type: true,
  //       // extras: {
  //       //   feature: "whatsapp_coexistence",
  //       // },
  //       extras: {
  //         setup: {},
  //         featureType: "whatsapp_business_app_onboarding", // set to 'whatsapp_business_app_onboarding'
  //         sessionInfoVersion: "3",
  //       },
  //     },
  //   );
  // };

  const getWhatsappIntegration = async () => {
    await getIntegration("WHATSAPP", String(accountId));
  };

  useEffect(() => {
    if (!accountId) return;
    getWhatsappIntegration();
  }, [accountId]);

  if (loading) {
    return (
      <div>
        <DataLoader className="h-[80vh]" />
      </div>
    );
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
