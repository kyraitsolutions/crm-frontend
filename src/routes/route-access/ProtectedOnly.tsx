import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { COOKIES_STORAGE } from "@/constants";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { AuthService } from "@/services";
import { AuthStoreManager } from "@/stores";

export const ProtectedOnly = () => {
  const token = CookieUtils.getItem(COOKIES_STORAGE.auth_token);
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const authService = new AuthService();
  const authManager = new AuthStoreManager();

  const existingUser = authManager.getUser();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      // ✅ if already exists, use it
      if (existingUser) {
        setUser(existingUser);
        setLoading(false);
        return;
      }

      try {
        const res: any = await authService.getMe();
        const userData = res.data?.docs;

        authManager.setUser(userData);
        setUser(userData);
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
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="size-10 animate-spin border-t-2 border-black rounded-full" />
      </div>
    );
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
