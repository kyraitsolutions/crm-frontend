import { Outlet, useNavigate } from "react-router-dom";
import { ProtectedLayout } from "./index";
import { AuthStoreManager } from "@/stores";
import { useEffect, useState } from "react";
import { AuthService, ToastMessageService } from "@/services";
import { COOKIES_STORAGE, DASHBOARD_PATH } from "@/constants";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { AccountService } from "@/services/account.service";
import { AccountsStoreManager } from "@/stores/accounts.store";

export function AppLayout() {
  const authService = new AuthService();
  const authManager = new AuthStoreManager();
  const toastService = new ToastMessageService();
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const getProfile = async () => {
    setIsLoading(true);
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
      // toastService.apiSuccess(response.message);
    } catch (error: any) {
      toastService.apiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const accountStoreManager = new AccountsStoreManager();
  const accountService = new AccountService();

  const fetchAccounts = async () => {
    try {
      const response = await accountService.getAccounts();

      if (response.status === 200) {
        accountStoreManager.setAccounts(response?.data?.docs);
        const accountId = CookieUtils.getItem(COOKIES_STORAGE.accountId);

        if (!accountId) {
          authManager.setAccountId(response?.data?.docs[0]?.id);
          navigate(
            DASHBOARD_PATH.getAccountPath(
              accountId || response?.data?.docs[0]?.id,
            ),
          );
        }
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    console.log("window.location", window.location);
    getProfile();
    fetchAccounts();
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
