import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { COOKIES_STORAGE, DASHBOARD_PATH } from "@/constants";
import { AccountService } from "@/services/account.service";
import { AuthStoreManager } from "@/stores";
import { AccountsStoreManager } from "@/stores/accounts.store";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function AppLayout() {
  const authManager = new AuthStoreManager();
  const navigate = useNavigate();

  const accountStoreManager = new AccountsStoreManager();
  const accountService = new AccountService();

  const fetchAccounts = async () => {
    try {
      const response = await accountService.getAccounts();

      if (response.status === 200) {
        accountStoreManager.setAccounts(response?.data?.docs);
        const accountId = CookieUtils.getItem(COOKIES_STORAGE.accountId);

        if (!accountId && response?.data?.docs?.length > 0) {
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
    fetchAccounts();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />

      <main className="w-full h-full flex flex-col p-2">
        <SiteHeader />

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
