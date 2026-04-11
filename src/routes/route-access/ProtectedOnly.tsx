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

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      if (user) {
        setLoading(false);
        return;
      }

      try {
        const res: any = await authService.getMe();
        const userData = res.data?.docs;

        authManager.setUser(userData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 🔄 loading state
  if (loading) {
    return <AppLoader />;
  }

  // not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

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
