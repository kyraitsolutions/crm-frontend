import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { SidebarMenu, SidebarMenuItem } from "./ui/sidebar";
import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react";
import { LocalStorageUtils } from "@/utils";
import { AuthStoreManager } from "@/stores";
import { AuthService } from "@/services";

const AddAccountPopup = () => {
  const authManager = new AuthStoreManager();
  const authService = new AuthService();
  const [open, setOpen] = useState<boolean>(false);
  const [accountName, setAccountName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddAccountButton, setShowAddAccountButton] = useState(false);

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

  const getProfile = async () => {
    try {
      const response: any = await authService.getProfile();
      // authManager.setUser(response.data?.docs);
      //   console.log(response);
      if (response?.data?.docs?.userprofile?.accountType === "organization") {
        setShowAddAccountButton(true);
      }
      if (!response.data?.docs?.onboarding) {
        // navigate("/on-boarding");
      }

      //   setIsLoading(false);
      //   toastService.apiSuccess(response.message);
    } catch (error: any) {
      console.log(error);
      //   toastService.apiError(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <SidebarMenu>
      {showAddAccountButton && (
        <SidebarMenuItem className="flex items-center gap-3">
          {/* 🟦 Unified hover group */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <div className="group flex flex-1 bg-white border items-center rounded-md transition-colors hover:bg-primary/10 cursor-pointer">
                {/* + Icon */}
                <div className="flex items-center justify-center w-9 h-9 text-primary group-hover:text-primary">
                  <IconCirclePlusFilled />
                </div>

                {/* Add New Account Button */}
                <Button
                  variant="ghost"
                  className="flex-1 justify-start text-primary font-medium hover:bg-transparent"
                >
                  Add New Account
                </Button>
              </div>
            </DialogTrigger>

            {/* Dialog Content */}
            <DialogContent className="sm:max-w-[425px]">
              <form
                className="flex flex-col gap-4"
                onSubmit={handleCreateAccount}
              >
                <DialogHeader>
                  <DialogTitle>Create New Account</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when
                    you&apos;re done.
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

          {/* ✉️ Mail icon with gap */}
          <Button size="icon" className="size-9 shrink-0" variant="outline">
            <IconMail />
            <span className="sr-only">Inbox</span>
          </Button>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
};

export default AddAccountPopup;
