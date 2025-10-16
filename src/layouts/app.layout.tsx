import { Outlet, useNavigate } from "react-router-dom";
import { ProtectedLayout } from "./index";
import { AuthStoreManager } from "@/stores";
import { useEffect, useState } from "react";
import { AuthService, ToastMessageService } from "@/services";

export function AppLayout() {
  const authService = new AuthService();
  const authManager = new AuthStoreManager();
  const toastService = new ToastMessageService();
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      const response = await authService.getProfile();
      authManager.setUser(response.data);

      if (!response.data?.isOnboardingCompleted) {
        navigate("/on-boarding");
      }

      setIsLoading(false);
    } catch (error: any) {
      toastService.apiError(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <ProtectedLayout>
      {isLoading ? (
        <div className="h-screen flex justify-center items-center">
          <div className="size-10 animate-spin border-t-2 border-t-black rounded-full" />
        </div>
      ) : (
        <Outlet />
      )}
    </ProtectedLayout>
  );
}
