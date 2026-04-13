import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  addTeamMemberSchema,
  type AddTeamMemberFormValues,
} from "@/types/team.type";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Loader from "@/components/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES } from "@/rbac";

const AddTeamMemberDialog = ({
  open,
  setOpen,
  onSubmit,
  accounts,
  loading,
  roles,
  level,
}: any) => {
  const accountMangerRole = roles?.find(
    (r: any) => r.name === ROLES.ACCOUNT_MANAGER,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<AddTeamMemberFormValues>({
    resolver: zodResolver(addTeamMemberSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      roleId: accountMangerRole?.id,
      accounts: [],
    },
  });

  const [selectedAccounts, setSelectedAccounts] = useState<
    { accountId: string; roleId: string }[]
  >([]);

  const handleAccountToggle = (accountId: string) => {
    setSelectedAccounts((prev) => {
      const exists = prev.find((a) => a.accountId === accountId);

      let updated;

      if (exists) {
        updated = prev.filter((a) => a.accountId !== accountId);
      } else {
        updated = [...prev, { accountId, roleId: "" }];
      }

      setValue("accounts", updated, { shouldValidate: true });
      return updated;
    });
  };

  const handleRoleChange = (accountId: string, roleId: string) => {
    const updated = selectedAccounts.map((acc) =>
      acc.accountId === accountId ? { ...acc, roleId } : acc,
    );

    setSelectedAccounts(updated);
    setValue("accounts", updated, { shouldValidate: true });
  };

  const submitHandler = (data: AddTeamMemberFormValues) => {
    onSubmit(data);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          reset();
          setSelectedAccounts([]);
        } // 🔥 clear form on close
      }}
    >
      <DialogOverlay className="bg-primary/10 backdrop-blur-sm" />
      <DialogContent className="max-h-[80vh] overflow-y-auto rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add Team Member
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          {/* USER INFO GRID */}
          <div className="grid grid-cols-2 gap-4">
            {/* FIRST NAME */}
            <div className="space-y-1">
              <Input
                placeholder="First Name"
                {...register("firstName")}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* LAST NAME */}
            <div>
              <Input
                placeholder="Last Name"
                {...register("lastName")}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <Input
              placeholder="Email"
              {...register("email")}
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* ORG ROLE */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              User's Role
            </p>

            <Select onValueChange={(value) => setValue("roleId", value)}>
              <SelectTrigger className="w-full focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Select Role (optional)" />
              </SelectTrigger>

              <SelectContent>
                {roles
                  .filter((role: any) => role.level <= level)
                  .map((role: any) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* ACCOUNTS */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Assign Accounts</h3>

            <div className="border rounded-xl p-3 space-y-3">
              {accounts?.map((acc: any) => {
                const selected = selectedAccounts.find(
                  (a) => a.accountId === acc.id,
                );

                return (
                  <div
                    key={acc.id}
                    className="grid grid-cols-12 items-center gap-3"
                  >
                    {/* Checkbox */}
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={!!selected}
                        onChange={() => handleAccountToggle(acc.id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </div>

                    {/* Account Name */}
                    <div className="col-span-5 text-sm truncate">
                      {acc.accountName}
                    </div>

                    {/* Role Dropdown */}
                    <div className="col-span-6">
                      {selected && (
                        <Select
                          value={selected.roleId}
                          onValueChange={(value) =>
                            handleRoleChange(acc.id, value)
                          }
                        >
                          <SelectTrigger className="h-8 text-xs focus:ring-0">
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>

                          <SelectContent>
                            {roles
                              .filter((role: any) => role.level <= level) // ✅ FIXED
                              .map((role: any) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.accounts && (
              <p className="text-red-500 text-xs">{errors.accounts?.message}</p>
            )}
          </div>

          {/* FOOTER */}
          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
                setSelectedAccounts([]);
              }}
            >
              Cancel
            </Button>

            <Button
              disabled={loading}
              type="submit"
              className="flex items-center gap-2"
            >
              Add {loading && <Loader />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamMemberDialog;
