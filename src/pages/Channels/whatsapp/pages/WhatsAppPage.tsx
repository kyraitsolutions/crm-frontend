import { useAuthStore } from "@/stores";
import { useIntegrationStore } from "@/stores/integration.store";
import { useEffect } from "react";
import { useWhatsAppStore } from "../store/whatsapp.store";
// import TemplatesPage from "./TemplatesPage";
import DataLoader from "@/components/Loader/data-loader";
import { ToastMessageService } from "@/services";
import type { ApiError } from "@/types";
import WhatsappConnect from "../sections/WhatsAppConnect";
import WhatsAppWorkspace from "../sections/WhatsAppWorkspace";

export const Whatsapp = () => {
  const toastService = new ToastMessageService();
  const { accountId } = useAuthStore();
  const { connect } = useWhatsAppStore();
  const { getIntegration, integration, loading } = useIntegrationStore(
    (state) => state,
  );

  console.log("integration", integration);

  const handleWhatsAppConnectFnc = async (payload: any) => {
    try {
      await connect(payload);
      getWhatsappIntegration();
    } catch (error) {
      const err = error as ApiError;
      if (err) {
        toastService.error(err.message || "Failed to connect");
      }
    }
  };

  const handleWhatsAppConnect = async () => {
    window.FB.login(
      (response: any) => {
        if (!response.authResponse) return;

        const code = response.authResponse.code;

        const payload = {
          code,
          accountId: String(accountId),
        };

        handleWhatsAppConnectFnc(payload);
      },
      {
        config_id: "887392707164005",
        response_type: "code",
        override_default_response_type: true,
        // extras: {
        //   feature: "whatsapp_coexistence",
        // },
        extras: {
          setup: {},
          featureType: "whatsapp_business_app_onboarding", // set to 'whatsapp_business_app_onboarding'
          sessionInfoVersion: "3",
        },
      },
    );
  };

  const getWhatsappIntegration = async () => {
    await getIntegration("WHATSAPP", String(accountId));
  };

  useEffect(() => {
    if (!accountId) return;
    getWhatsappIntegration();
  }, [accountId]);

  // useEffect(() => {
  //   const handleMessage = (event: MessageEvent) => {
  //     // Always verify the origin
  //     if (!event.origin.includes("facebook.com")) {
  //       return;
  //     }

  //     console.log("Meta Message:", JSON.parse(event.data));

  //     // You can inspect the payload here
  //   };

  //   window.addEventListener("message", handleMessage);

  //   return () => {
  //     window.removeEventListener("message", handleMessage);
  //   };
  // }, []);

  console.log("Integration Data:", integration);

  if (loading) {
    return (
      <div>
        <DataLoader className="h-[80vh]" />
      </div>
    );
  }

  return (
    <section className="h-[calc(100vh-64px)] overflow-y-scroll hide-scrollbar px-3 py-2">
      {integration && integration?.connected ? (
        <WhatsAppWorkspace />
      ) : (
        <WhatsappConnect onConnect={handleWhatsAppConnect} />
      )}
      {/* <TemplatesPage /> */}
      {/* <WhatsappConnect onConnect={handleWhatsAppConnect} /> */}
    </section>
  );
};
