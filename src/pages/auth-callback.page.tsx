import { AuthCallbackLoader } from "@/components/Loader/auth-callback-loader";
import { COOKIES_STORAGE } from "@/constants";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const authCallbackHandler = async () => {
      const token = new URLSearchParams(location.search).get("token");
      console.log(token);
      // const isOnboarding = new URLSearchParams(location.search).get(
      //   "onboarding",
      // );

      if (!token) {
        return;
      }
      CookieUtils.setItem(COOKIES_STORAGE.auth_token, token);
      navigate("/dashboard");

      // if (isOnboarding !== "true") {
      //   navigate("/on-boarding");
      // } else {
      //   navigate("/dashboard");
      // }
    };
    authCallbackHandler();
  }, [location.pathname, location.search, navigate]);

  return <AuthCallbackLoader />;
};
