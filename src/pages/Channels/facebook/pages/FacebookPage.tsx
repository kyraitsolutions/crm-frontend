import { useAuthStore } from "@/stores";
import { useIntegrationStore } from "@/stores/integration.store";
import { useMetaStore } from "../store/meta.store";
import { ToastMessageService } from "@/services";
import type { ApiError } from "@/types";
import MetaConnect from "../sections/MetaConnect";
import { useNavigate } from "react-router-dom";
import { FACEBOOK_PATHS } from "@/constants/routes/facebook.path";
import {  useRef } from "react";

// const META_OAUTH_SUCCESS = "META_OAUTH_SUCCESS";
// const META_OAUTH_ERROR = "META_OAUTH_ERROR";

export const Facebook = () => {
  const toastService = new ToastMessageService();
  const { accountId } = useAuthStore();
  const { connect, setConnecting } = useMetaStore();
  const { getIntegration } = useIntegrationStore((state) => state);
  const navigate = useNavigate();
  const popupRef = useRef<Window | null>(null);

  const finishConnect = async () => {
    const integration = await getIntegration("facebook", String(accountId));
    if (integration?.connected) {
      navigate(FACEBOOK_PATHS.OVERVIEW);
    }
  };

  // useEffect(() => {
  //   const handleMessage = async (event: MessageEvent) => {
  //     if (event.origin !== window.location.origin) return;

  //     if (event.data?.type === META_OAUTH_SUCCESS) {
  //       popupRef.current?.close();
  //       setConnecting(false);
  //       await finishConnect();
  //       return;
  //     }

  //     if (event.data?.type === META_OAUTH_ERROR) {
  //       popupRef.current?.close();
  //       setConnecting(false);
  //       toastService.error(
  //         event.data?.message || "Failed to connect Facebook",
  //       );
  //     }
  //   };

  //   window.addEventListener("message", handleMessage);
  //   return () => window.removeEventListener("message", handleMessage);
  // }, [accountId]);

  const handleMetaConnect = async () => {
    try {
      if (!accountId) return;

      const response = await connect({ accountId: String(accountId) });
      const signupUrl = response?.signupUrl;

      if (!signupUrl) {
        setConnecting(false);
        toastService.error("Meta authorization URL is missing");
        return;
      }

      popupRef.current = window.open(
        signupUrl,
        "meta-login",
        "width=600,height=700,left=200,top=100",
      );

      if (!popupRef.current) {
        setConnecting(false);
        toastService.error("Please allow popups to connect Facebook");
        return;
      }

      const timer = window.setInterval(() => {
        if (popupRef.current && popupRef.current.closed) {
          window.clearInterval(timer);
          setConnecting(false);
          finishConnect();
        }
      }, 800);
    } catch (error) {
      setConnecting(false);
      const err = error as ApiError;
      toastService.error(err.message || "Failed to connect Facebook");
    }
  };

  return (
    <section className="h-[calc(100vh-64px)] overflow-y-scroll hide-scrollbar px-3 py-2">
      <MetaConnect onConnect={handleMetaConnect} />
    </section>
  );
};

export default Facebook;
