import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { COOKIES_STORAGE } from "@/constants";
import { ACCOUNT_PATHS } from "@/constants/routes";
import { ToastMessageService } from "@/services";
import { AccountService } from "@/services/account.service";
import { AuthStoreManager, useAuthStore } from "@/stores";
import { AccountAccessManager } from "@/stores/account-access.store";
import { AccountsStoreManager } from "@/stores/accounts.store";
import type { ApiError } from "@/types";
// 👈 NEW
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function AppLayout() {
  // store managers
  const authManager = new AuthStoreManager();
  const accountStoreManager = new AccountsStoreManager();
  const accountAccessManager = new AccountAccessManager();

  // services
  const accountService = new AccountService();
  const toastService = new ToastMessageService();
  const navigate = useNavigate();

  // 👇 IMPORTANT: reactive accountId
  const { accountId } = useAuthStore((state) => state);

  // fetch accounts list
  const fetchAccounts = async () => {
    try {
      const response = await accountService.getAccounts();

      if (response.status === 200) {
        const accounts = response?.data?.docs;
        accountStoreManager.setAccounts(accounts);

        const storedAccountId = CookieUtils.getItem(COOKIES_STORAGE.accountId);

        // 👉 If no account selected → pick first
        if (!storedAccountId && accounts?.length > 0) {
          const firstAccountId = accounts[0].id;
          authManager.setAccountId(firstAccountId);
          navigate(ACCOUNT_PATHS.byId(firstAccountId));
        }
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  // fetch account access (RBAC permissions)
  const fetchAccountAccess = async (accountId: string) => {
    try {
      const res = await accountService.getAccountAccess(accountId);

      if (res?.status === 200) {
        accountAccessManager.setAccess(res.data?.doc);
      }
    } catch (error) {
      const err = error as ApiError;
      toastService?.apiError(err.message || "Failed to fetch account access");
    }
  };

  // fetch accounts initially
  useEffect(() => {
    fetchAccounts();
  }, []);

  // fetch account access when accountId changes
  useEffect(() => {
    if (!accountId) return;

    fetchAccountAccess(accountId);
  }, [accountId]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <AppSidebar />

      <main className="w-full flex flex-col">
        <SiteHeader />

        <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto ">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// import { AppSidebar } from "@/components/app-sidebar";
// import { SiteHeader } from "@/components/site-header";
// import { COOKIES_STORAGE, DASHBOARD_PATH } from "@/constants";
// import { AccountService } from "@/services/account.service";
// import { AuthStoreManager } from "@/stores";
// import { AccountsStoreManager } from "@/stores/accounts.store";
// import { CookieUtils } from "@/utils/cookie-storage.utils";
// import { useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";

// export function AppLayout() {
//   const authManager = new AuthStoreManager();
//   const navigate = useNavigate();

//   const accountStoreManager = new AccountsStoreManager();
//   const accountService = new AccountService();

//   const fetchAccounts = async () => {
//     try {
//       const response = await accountService.getAccounts();

//       if (response.status === 200) {
//         accountStoreManager.setAccounts(response?.data?.docs);
//         const accountId = CookieUtils.getItem(COOKIES_STORAGE.accountId);

//         if (!accountId && response?.data?.docs?.length > 0) {
//           authManager.setAccountId(response?.data?.docs[0]?.id);
//           navigate(
//             DASHBOARD_PATH.getAccountPath(
//               accountId || response?.data?.docs[0]?.id,
//             ),
//           );
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching accounts:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAccounts();
//   }, []);

//   return (
//     <div className="flex h-screen overflow-hidden">
//       <AppSidebar />

//       <main className="w-full h-full flex flex-col p-2">
//         <SiteHeader />

//         <div className="flex-1 overflow-y-auto">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// }
