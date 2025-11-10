import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LocalStorageUtils } from "@/utils";
import { useEffect, useState } from "react";

export const Accounts = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Account Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="">Created At</TableHead>
          <TableHead className="">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.map((account) => (
          <TableRow key={account.id}>
            <TableCell className="font-medium">{account.accountName}</TableCell>
            <TableCell>{account.email}</TableCell>
            <TableCell>
              {account.status === "active" ? (
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-500 cursor-pointer"
                >
                  Active
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-red-600 border-red-500 cursor-pointer"
                >
                  Inactive
                </Badge>
              )}
            </TableCell>
            <TableCell className="">{account.createdAt}</TableCell>
            <TableCell className="">
              {/* add a delete icon to deletet hsi account using shadcn*/}
              <Badge
                onClick={() => handleDeleteAccount(account.id)}
                variant="outline"
                className="text-red-600 border-red-500 cursor-pointer"
              >
                Delete
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
