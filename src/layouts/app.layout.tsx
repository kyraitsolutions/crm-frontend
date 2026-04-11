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
    <div className="flex h-screen">
      <AppSidebar />

      <main className="w-full h-screen overflow-y-scroll">
        <SiteHeader />
        <Outlet />
      </main>
    </div>

    // <ProtectedLayout>
    //   {isLoading ? (
    //     <div className="h-screen flex justify-center items-center">
    //       <div className="size-10 animate-spin border-t-2 border-t-black rounded-full" />
    //     </div>
    //   ) : (
    //     <div className="flex h-screen">
    //       <AppSidebar />

    //       <main className="w-full h-screen overflow-y-scroll">
    //         <SiteHeader />
    //         <Outlet />
    //       </main>
    //     </div>
    //   )}
    // </ProtectedLayout>
  );
}
