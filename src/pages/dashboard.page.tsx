import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { AuthStoreManager, useAuthStore } from "@/stores";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DASHBOARD_PATH } from "@/constants";
import { formatDate } from "@/utils/date-utils";
export const DashboardPage = () => {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.user);
  const authManager = new AuthStoreManager();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [open, setOpen] = useState<boolean>(false);
  const [accountName, setAccountName] = useState("");
  const [email, setEmail] = useState("");
  const [currentSelectedAccountIndex, setCurrentSelectedAccountIndex] =
    useState<number | null>(null);
  // const [loading, setLoading] = useState(false);

  // ✅ Function to create account
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LocalStorageUtils.getItem("token")}`, // 👈 replace dynamically if needed
        },
        body: JSON.stringify({
          accountName,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create account");
      }

      const data = await response.json();
      console.log("✅ Account created:", data);
      setAccounts((prev) => [...prev, data?.result?.docs]);

      // Close dialog after success
      setOpen(false);

      // Optional: reset form fields
      setAccountName("");
      setEmail("");
    } catch (error) {
      console.error("❌ Error creating account:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (index: number) => {
    setCurrentSelectedAccountIndex(index);

    if (authUser)
      authManager?.setUser({
        ...authUser,
        account: {
          ...accounts[index],
          selectedAccount: accounts[index]?.accountName,
          isAccountSelected: true,
        },
      });

    navigate(
      DASHBOARD_PATH.getAccountPath(
        accounts[index]?.id,
        accounts[index]?.accountName
      )
    );
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/account/${accountId}`,
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
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/account", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${LocalStorageUtils.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch accounts");
        }

        const data = await res.json();
        console.log(data.result);
        setAccounts(data.result.docs);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>
        <Card className="p-6">
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  const bgGradients = [
    "bg-gradient-to-tr from-red-50 to-red-50",
    "bg-gradient-to-tr from-blue-50 to-blue-100",
    "bg-gradient-to-tr from-green-50 to-green-100",
    "bg-gradient-to-tr from-purple-50 to-purple-100",
    "bg-gradient-to-tr from-pink-50 to-pink-100",
    "bg-gradient-to-tr from-yellow-50 to-yellow-100",
  ];

  return (
    <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-5 p-5">
      {accounts.map((account, idx) => {
        const initials = account.accountName
          .split(" ")
          .map((n) => n[0])
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
                  handleDeleteAccount(account.id);
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="group h-[150px] border-2 border-dashed flex flex-1 justify-center rounded-md bg-white items-center rounded-md transition-colors hover:bg-primary/10 cursor-pointer">
            <Button
              variant="ghost"
              className=" text-primary font-medium hover:bg-transparent"
            >
              <IconCirclePlusFilled className="size-10" />
              Add New Account
            </Button>
          </div>
        </DialogTrigger>

        {/* Dialog Content */}
        <DialogContent className="sm:max-w-[425px]">
          <form className="flex flex-col gap-4" onSubmit={handleCreateAccount}>
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
    </div>
  );
};
