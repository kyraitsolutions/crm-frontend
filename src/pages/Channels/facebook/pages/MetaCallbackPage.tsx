import { FACEBOOK_PATHS } from "@/constants/routes/facebook.path";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const META_OAUTH_SUCCESS = "META_OAUTH_SUCCESS";
const META_OAUTH_ERROR = "META_OAUTH_ERROR";

export default function MetaCallbackPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const message = searchParams.get("message");

  useEffect(() => {
    const type = status === "success" ? META_OAUTH_SUCCESS : META_OAUTH_ERROR;

    window.opener?.postMessage(
      { type, message },
      window.location.origin,
    );

    window.close();

    if (!window.opener) {
      window.location.replace(
        status === "success" ? FACEBOOK_PATHS.OVERVIEW : FACEBOOK_PATHS.ROOT,
      );
    }
  }, [status, message]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <p className="text-sm text-slate-500">
        {status === "success"
          ? "Facebook connected. You can close this window."
          : "Connection failed. You can close this window."}
      </p>
    </div>
  );
}
