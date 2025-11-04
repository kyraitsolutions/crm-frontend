import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LocalStorageUtils } from "@/utils";
import { useEffect, useState } from "react";

import { IconCirclePlusFilled } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
export const DashboardPage = () => {

  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [open, setOpen] = useState<boolean>(false);
  const [accountName, setAccountName] = useState("");
  const [email, setEmail] = useState("");
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
          Authorization: `Bearer ${LocalStorageUtils.getItem('token')}`, // 👈 replace dynamically if needed
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


  useEffect(() => {
    const fetchAccounts = async () => {
      try {

        const res = await fetch("http://localhost:3000/api/account", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${LocalStorageUtils.getItem('token')}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch accounts");
        }

        const data = await res.json();
        console.log(data.result)
        setAccounts(data.result.docs);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);


  const handleDeleteAccount = async (accountId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/account/${accountId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LocalStorageUtils.getItem('token')}`,
        },
      });

      console.log(await response.json())
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5  p-5 gap-5">
      {accounts.map((account) => (
        <Card key={account.id}>
          <CardHeader>
            <CardTitle className="capitalize">{account.accountName}</CardTitle>
            <CardDescription>{account.email}</CardDescription>
            <CardAction>
              <Badge onClick={() => handleDeleteAccount(account.id)} variant="outline" className="text-red-600 border-red-500 cursor-pointer">
                Delete
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter>
            <p className="text-xs">{account.createdAt}</p>
          </CardFooter>
        </Card>
      ))}


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
