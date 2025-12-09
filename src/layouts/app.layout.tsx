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
      const response: any = await authService.getProfile();
      const user = response.data?.docs;
      authManager.setUser(user);

      const isOnBoardingPage = window.location.pathname === "/on-boarding";

      if (!user.onboarding) {
        // User not completed onboarding → allow only onboarding page
        if (!isOnBoardingPage) navigate("/on-boarding");
      } else {
        // User completed onboarding → block onboarding page
        if (isOnBoardingPage) navigate("/dashboard");
      }
      toastService.apiSuccess(response.message);
    } catch (error: any) {
      toastService.apiError(error);
    } finally {
      setIsLoading(false);
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
