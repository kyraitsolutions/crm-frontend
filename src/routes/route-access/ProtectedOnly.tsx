import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { COOKIES_STORAGE } from "@/constants";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { AuthService } from "@/services";
import { AuthStoreManager, useAuthStore } from "@/stores";
import AppLoader from "@/components/Loader/app-loader";

export const ProtectedOnly = () => {
  const token = CookieUtils.getItem(COOKIES_STORAGE.auth_token);
  const location = useLocation();
  const { user } = useAuthStore((state) => state);

  const [loading, setLoading] = useState(true);

  const authService = new AuthService();
  const authManager = new AuthStoreManager();

  const fetchUser = async () => {
    console.log("ider to aara hai");
    console.log("user", user);
    if (!token) {
      setLoading(false);
      return;
    }

    if (user) {
      setLoading(false);
      return;
    }

    try {
      const res = await authService.getMe();

      console.log("User profile response:", res.data); // Log the response for debugging
      const userData = res.data?.doc;

      authManager.setUser(userData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔄 loading state
  if (loading) {
    return <AppLoader />;
  }

  // not logged in
  if (!token) {
    CookieUtils.removeItem(COOKIES_STORAGE.auth_token);
    CookieUtils.removeItem(COOKIES_STORAGE.accountId);
    return <Navigate to="/login" replace />;
  }

  console.log(user);
  // onboarding not completed
  if (user && !user.onboarding) {
    if (location.pathname !== "/on-boarding") {
      return <Navigate to="/on-boarding" replace />;
    }
  }

  // already onboarded but trying onboarding page
  if (user?.onboarding && location.pathname === "/on-boarding") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
