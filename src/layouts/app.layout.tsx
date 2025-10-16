import { Outlet } from "react-router-dom";
import { ProtectedLayout } from "./index";
import { AuthStoreManager } from "@/stores";
import { useEffect } from "react";
import { AuthService, ToastMessageService } from "@/services";

export function AppLayout() {
  const authService = new AuthService();
  const authManager = new AuthStoreManager();
  const toastService = new ToastMessageService();

  const getProfile = async () => {
    try {
      const response = await authService.getProfile();
      authManager.setUser(response.data);
    } catch (error: any) {
      toastService.apiError(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <ProtectedLayout>
      <Outlet />
    </ProtectedLayout>
  );
}
