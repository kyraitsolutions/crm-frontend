import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LocalStorageUtils } from "@/utils";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
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
import { AuthStoreManager, useAuthStore } from "@/stores";
import { alertManager } from "@/stores/alert.store";
import { formatDate } from "@/utils/date-utils";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastMessageService } from "@/services";
import type { ApiError } from "@/types";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { AccountService } from "@/services/account.service";
import { PremiumPopup } from "@/components/popup/PremiumPopup";

export const DashboardPage = () => {
  const accountService = new AccountService();
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.user);
  const authManager = new AuthStoreManager();
  const toastService = new ToastMessageService();
  const { user } = useAuthStore((state) => state);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
    // setLoading(true);

    try {
      const response = await accountService.createAccount({
        accountName,
        email,
      });

      if (response.status === 200) {
        setAccounts((prev) => [...prev, response?.data?.docs]);
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
      }
      if (err) {
        // toastService.error(err.responseMessage);
      }
    } finally {
      setLoading(false);
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
    try {
      const response = await fetch(
        `https://crm-backend-7lf9.onrender.com/api/account/${accountId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LocalStorageUtils.getItem("token")}`,
          },
        }
      );

      console.log(await response.json());
      if (!response.ok) {
        throw new Error("Failed to delete account");
      }
      // Remove deleted account from state
      setAccounts((prevAccounts) =>
        prevAccounts.filter((account) => account.id !== accountId)
      );
      toastService.success("Account deleted successfully");
    } catch (error) {
      console.error("Error deleting account:", error);
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
    try {
      const res = await fetch(
        "https://crm-backend-7lf9.onrender.com/api/account",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${LocalStorageUtils.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const data = await res.json();
      setAccounts(data.result.docs);
      console.log(data);

      if (
        user?.userprofile?.accountType?.toLowerCase() === "individual" &&
        data?.result?.docs?.length === 1
      ) {
        navigate(DASHBOARD_PATH.getAccountPath(data?.result?.docs[0]?.id));
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
    <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-5 p-5">
      {accounts.map((account, idx) => {
        const initials = account?.accountName
          ?.split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase();

        return (
          <div
            key={account.id}
            onClick={() => handleProfileClick(idx)}
            className={`space-y-8 border border-accent cursor-pointer transform transition-all duration-300 hover:scale-105 rounded-xl py-6 px-4 bg-white shadow-sm ${
              currentSelectedAccountIndex === idx
                ? "ring-2 ring-blue-400 shadow-lg"
                : ""
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              {/* Left: Avatar + Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="size-8 rounded-full bg-blue-300 flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {account.accountName}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
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
                className="text-red-600 hover:text-red-800 p-2 rounded-md flex-shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center text-gray-500 text-xs font-medium">
              <span>Created: {formatDate(account.createdAt)}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  account.status === "active"
                    ? "bg-green-100 text-green-600"
                    : account.status === "inactive"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {account.status}
              </span>
            </div>
          </div>
        );
      })}

      {user?.userprofile?.accountType === "organization" && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div className="group h-[150px] border-2 border-dashed flex flex-1 justify-center bg-white items-center rounded-md transition-colors hover:bg-primary/10 cursor-pointer">
              <Button
                variant="ghost"
                className=" text-primary font-medium hover:bg-transparent"
              >
                <IconCirclePlusFilled className="size-10" />
                Add New Account
              </Button>
            </div>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <form
              className="flex flex-col gap-4"
              onSubmit={handleCreateAccount}
            >
              <DialogHeader>
                <DialogTitle>Create New Account</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Account Name</Label>
                  <Input
                    id="name-1"
                    name="name"
                    placeholder="Enter account name"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create"}
                </Button>
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
