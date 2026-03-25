import { Navigate, Outlet } from "react-router-dom";
import { COOKIES_STORAGE } from "@/constants";
import { CookieUtils } from "@/utils/cookie-storage.utils";

export const PublicOnly = () => {
  const token = CookieUtils.getItem(COOKIES_STORAGE.auth_token);

  if (token) {
    return <Navigate to="/dashboard" replace />; // or dashboard
  }

  return <Outlet />;
};
