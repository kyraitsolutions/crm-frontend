import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

import Loader from "@/components/Loader";
import { PremiumPopup } from "@/components/popup/PremiumPopup";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COOKIES_STORAGE, DASHBOARD_PATH } from "@/constants";
import { ToastMessageService } from "@/services";
import { AccountService } from "@/services/account.service";
import { AuthStoreManager, useAuthStore } from "@/stores";
import {
  AccountsStoreManager,
  useAccountsStore,
} from "@/stores/accounts.store";
import { alertManager } from "@/stores/alert.store";
import type { ApiError } from "@/types";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { formatDate } from "@/utils/date-utils";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DashboardPage = () => {
  const navigate = useNavigate();

  //services
  const accountService = new AccountService();
  const authManager = new AuthStoreManager();
  const toastService = new ToastMessageService();

  // store managers
  const accountStoreManager = new AccountsStoreManager();
  const { accounts } = useAccountsStore((state) => state);
  const { user } = useAuthStore((state) => state);
  const authUser = useAuthStore((state) => state.user);
  // const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);

  const [openPremium, setOpenPremium] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [accountName, setAccountName] = useState("");
  const [email, setEmail] = useState("");
  const [currentSelectedAccountIndex, setCurrentSelectedAccountIndex] =
    useState<number | null>(null);
  // const [loading, setLoading] = useState(false);

  // ✅ Function to create account
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCreate(true);

    try {
      const response = await accountService.createAccount({
        accountName,
        email,
      });

      if (response.status === 201 || response.status === 200) {
        accountStoreManager.setAccountTop({
          accountName,
          email,
          id: response?.data?.docs?.id,
          createdAt: new Date().toISOString(),
          status: "active",
        });

        toastService.success("Account created successfully");
        // setAccounts((prev) => [...prev, response?.data?.docs]);
      }
      // setAccounts((prev) => [...prev, data?.result?.docs]);

      // Close dialog after success
      setOpen(false);

      // Optional: reset form fields
      setAccountName("");
      setEmail("");
    } catch (error) {
      const err = error as ApiError;
      if (err.status === 403) {
        setOpenPremium(true);
        setOpen(false);
        // setTimeout(() => {
        //   navigate("/dashboard/subscription");
        // }, 3000);
      } else {
        toastService.apiError(err.message);
      }
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleProfileClick = (index: number) => {
    setCurrentSelectedAccountIndex(index);

    if (authUser) {
      authManager?.setUser({
        ...authUser,
        account: {
          ...accounts[index],
          selectedAccount: accounts[index]?.accountName,
          isAccountSelected: true,
        },
      });

      authManager.setAccountSelected(true);
    }

    CookieUtils.setItem(COOKIES_STORAGE.accountId, accounts[index]?.id);
    navigate(DASHBOARD_PATH.getAccountPath(accounts[index]?.id));
  };

  const handleDeleteAccount = async (accountId: string) => {
    const rollback = accountStoreManager.deleteAccountOptimistic(accountId);
    try {
      const response = await accountService.deleteAccount(accountId);
      if (response.status === 200) {
        toastService.success("Account deleted successfully");
      }
    } catch (error) {
      rollback();
      const err = error as ApiError;
      if (err) {
        toastService.apiError(err.message);
      }
    }
  };

  const handleDeleAccountClick = (accountId: string) => {
    alertManager.show({
      type: "warning",
      title: "Delete Account",
      message: "Are you sure you want to delete this account?",
      onConfirm: () => {
        handleDeleteAccount(accountId);
      },
    });
  };

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await accountService.getAccounts();
      if (response.status === 200) {
        accountStoreManager.setAccounts(response?.data?.docs);
        if (
          user?.userprofile?.accountType?.toLowerCase() === "individual" &&
          response?.data?.docs?.length === 1
        ) {
          navigate(DASHBOARD_PATH.getAccountPath(response?.data?.docs[0]?.id));
        }
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="p-5 space-y-4 w-[300px]">
        <Card className="p-2">
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (


    <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6 px-5 py-5">
      {accounts.map((account, idx) => {
        const initials = account?.accountName
          ?.split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase();

        const isActive = currentSelectedAccountIndex === idx;

        return (
          <div
            key={account.id}
            onClick={() => handleProfileClick(idx)}
            className={`
        relative flex flex-col justify-between gap-4
        px-4 py-3
        cursor-pointer
        transition-all duration-200
        ${isActive ? "ring-1 ring-[#37322F]" : ""}
        hover:bg-[rgba(55,50,47,0.04)]
      `}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-full bg-[#37322F] text-[#FBFAF9] flex items-center justify-center text-xs font-medium">
                  {initials}
                </div>

                <div className="min-w-0 flex flex-col">
                  <h3 className="text-md font-medium capitalize text-[#37322F] truncate">
                    {account.accountName}
                  </h3>
                  <p className="text-sm text-[#847971] truncate">
                    {account.email}
                  </p>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleAccountClick(account.id);
                }}
                className="p-1 rounded-md text-[#847971] hover:text-red-600 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center text-xs font-medium">
              <span className="text-[#847971]">
                Created: {formatDate(account.createdAt)}
              </span>

              <span
                className={`
            px-2 py-0.5 rounded-full text-xs font-medium
            ${account.status === "active"
                    ? "bg-[rgba(55,50,47,0.08)] text-[#37322F]"
                    : account.status === "inactive"
                      ? "bg-[rgba(132,121,113,0.12)] text-[#847971]"
                      : "bg-[rgba(220,38,38,0.10)] text-red-700"
                  }
          `}
              >
                {account.status}
              </span>
            </div>
          </div>
        );
      })}


      {/* Add New Account */}
      {user?.userprofile?.accountType === "organization" && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div
              className="
            flex flex-col justify-center items-center gap-2
            px-6 py-5
            border-2 border-dashed border-[rgba(50,45,43,0.20)]
            rounded-xl
            cursor-pointer
            transition-all
            hover:bg-[rgba(55,50,47,0.04)]
          "
            >
              <IconCirclePlusFilled className="size-10 text-[#37322F]" />
              <span className="text-sm font-medium text-[#37322F]">
                Add New Account
              </span>
            </div>
          </DialogTrigger>

          {/* Dialog stays unchanged */}
          <DialogContent
            className="
    sm:max-w-[420px]
    rounded-2xl
    border border-[rgba(50,45,43,0.12)]
    p-6
    shadow-[0px_12px_24px_rgba(55,50,47,0.12)]
  "
          >
            <form
              className="flex flex-col gap-6"
              onSubmit={handleCreateAccount}
            >
              {/* Header */}
              <DialogHeader className="gap-2">
                <DialogTitle className="text-xl font-medium text-[#37322F]">
                  Create New Account
                </DialogTitle>
                <DialogDescription className="text-sm text-[#847971]">
                  Set up a new account to manage your workspace.
                </DialogDescription>
              </DialogHeader>

              {/* Fields */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-[#37322F]">
                    Account Name
                  </Label>
                  <Input
                    name="name"
                    placeholder="Enter account name"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                    className="
                mt-2
                bg-[#F7F6F4]
                border-none
                rounded-lg
                focus-visible:ring-0
                text-[#37322F]
          "
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-[#37322F]">
                    Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="
                mt-2
                bg-[#F7F6F4]
                border-none
                rounded-lg
                focus-visible:ring-0
                text-[#37322F]
          "
                  />
                </div>
              </div>

              {/* Footer */}
              <DialogFooter className="flex justify-end gap-3 pt-2">
                <DialogClose asChild>
                  <button
                    type="button"
                    className="
              px-4 py-2 rounded-[99px]
              border border-[rgba(50,45,43,0.20)]
              text-sm font-medium text-[#37322F]
              hover:bg-[rgba(55,50,47,0.05)]
              transition
          "
                  >
                    Cancel
                  </button>
                </DialogClose>

                <button
                  type="submit"
                  disabled={loading}
                  className="
            relative px-5 py-2 flex items-center gap-2 rounded-[99px]
            bg-[#37322F]
            text-sm font-medium text-[#FBFAF9]
            shadow-[0px_2px_4px_rgba(55,50,47,0.12)]
            disabled:opacity-60
            transition
        "
                >
                  Create {loadingCreate && <Loader />}
                </button>
              </DialogFooter>
            </form>
          </DialogContent>

        </Dialog>
      )}

      {openPremium && (
        <PremiumPopup open={openPremium} onOpenChange={setOpenPremium} />
      )}
    </div>

  );
};


