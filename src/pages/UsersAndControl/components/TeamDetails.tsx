import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES } from "@/rbac";
import type { IAccount } from "@/types/accounts.type";
import type { ITeam } from "@/types/teams.type";
import { formatDate } from "@/utils/date-utils";
import { Pencil, Phone } from "lucide-react";
import React, { useEffect, useState } from "react";

type TeamDetailsProps = {
  user: ITeam;
  accounts: IAccount[];
  roles: any[];
  level: number;
  editLoading?: boolean;
  onUpdate: (data: any) => void;
};

const TeamDetails: React.FC<TeamDetailsProps> = ({
  user,
  accounts,
  roles,
  level,
  editLoading,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // 🔥 FORM STATE
  const [formData, setFormData] = useState({
    firstName: user.userProfile.firstName,
    lastName: user.userProfile.lastName,
    phone: user?.userProfile?.phone || "",
    email: user.email,
  });

  // 🔥 ROLE STATE
  const [selectedRole, setSelectedRole] = useState(user?.role?.id || "");

  // 🔥 ACCOUNTS STATE
  const [selectedAccounts, setSelectedAccounts] = useState<
    { accountId: string; roleId: string }[]
  >(user.accounts || []);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  // 🔥 ACCOUNT TOGGLE
  const handleAccountToggle = (accountId: string) => {
    setSelectedAccounts((prev) => {
      const exists = prev.find((a) => a.accountId === accountId);

      if (exists) {
        return prev.filter((a) => a.accountId !== accountId);
      }

      return [...prev, { accountId, roleId: roles[0].id }];
    });
  };

  // 🔥 ACCOUNT ROLE CHANGE
  const handleRoleChange = (accountId: string, roleId: string) => {
    setSelectedAccounts((prev) =>
      prev.map((acc) =>
        acc.accountId === accountId ? { ...acc, roleId } : acc,
      ),
    );
  };

  // CANCEL

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedAccounts(user.accounts);
  };

  // 🔥 SAVE
  const handleSave = () => {
    const isRoleIdChange = selectedRole !== user.role.id;
    const isAccountsChange = selectedAccounts.length !== user.accounts.length;

    const payload = {
      ...formData,
      userId: user.userId,
      ...(isRoleIdChange && { roleId: selectedRole }),
      ...(isAccountsChange && { accounts: selectedAccounts }),
    };

    if (onUpdate) {
      onUpdate(payload);
    }

    console.log("FINAL PAYLOAD:", payload);

    // setIsEditing(false);
  };

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.userProfile.firstName,
        lastName: user.userProfile.lastName,
        phone: user?.userProfile?.phone || "",
        email: user.email,
      });

      setSelectedRole(user.role.id);
      setSelectedAccounts(user.accounts);
    }
  }, [user]);

  return (
    <div className="bg-white">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center text-lg font-semibold">
            {user.userProfile.firstName?.[0]}
          </div>

          <div>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  className="focus-visible:ring-0 focus-visible:border-primary/60 border-primary/60 rounded-xl"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                />
                <Input
                  className="focus-visible:ring-0 focus-visible:border-primary/60 border-primary/60 rounded-xl"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                />

                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="focus-visible:ring-0 focus-visible:border-primary/60 border-primary/60 rounded-xl w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>

                  <SelectContent>
                    {roles
                      .filter((r: any) => r.level <= level)
                      .map((r: any) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Input
                  className="focus-visible:ring-0 focus-visible:border-primary/60 border-primary/60 rounded-xl"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
            ) : (
              <h2 className="text-lg font-semibold">
                {user.userProfile.firstName} {user.userProfile.lastName}
              </h2>
            )}

            {/* ROLE */}
            {!isEditing && (
              <span className="inline-block mt-1 text-xs px-2 py-1 rounded-md bg-blue-100 text-blue-700">
                {user.role.name}
              </span>
            )}
          </div>
        </div>

        {!isEditing && user?.role?.name !== ROLES.OWNER && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-sm bg-primary p-2 text-white rounded-xl hover:underline cursor-pointer"
          >
            <Pencil size={16} />
            Edit
          </button>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {/* <div className="flex items-center gap-3">
          <Mail size={16} className="text-gray-400" />
          {isEditing ? "" : <p className="text-sm">{user.email}</p>}
        </div> */}

        <div className="flex items-center gap-3">
          <Phone size={16} className="text-gray-400" />
          {isEditing ? (
            <Input
              className="focus-visible:ring-0 focus-visible:border-primary/60 border-primary/60 rounded-xl"
              placeholder="Mobile"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          ) : (
            <p className="text-sm text-gray-500">
              {user?.userProfile?.phone || "-"}
            </p>
          )}
        </div>

        <p className="text-xs text-gray-500">
          Joined {formatDate(user.createdAt)}
        </p>
      </div>

      {/* ACCOUNTS SECTION */}
      <div>
        <h3 className="text-sm font-semibold mb-3">
          {user?.role?.name !== ROLES.OWNER && "Assigned "} Accounts
        </h3>

        {isEditing ? (
          <div className="border rounded-xl divide-y">
            {accounts.map((acc: any) => {
              const selected = selectedAccounts.find(
                (a) => a.accountId === acc.id,
              );

              return (
                <div
                  key={acc.id}
                  className="flex items-center justify-between p-3"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={!!selected}
                      onChange={() => handleAccountToggle(acc.id)}
                    />

                    <span className="text-sm font-medium">
                      {acc.accountName}
                    </span>
                  </div>

                  {selected && (
                    <div className="">
                      <Select
                        value={selected.roleId}
                        onValueChange={(val) => handleRoleChange(acc.id, val)}
                      >
                        <SelectTrigger className="focus-visible:ring-0 focus-visible:border-primary/60 border-primary/60 rounded-xl w-full">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>

                        <SelectContent>
                          {roles
                            .filter((r: any) => r.level <= level)
                            .map((r: any) => (
                              <SelectItem key={r.id} value={r.id}>
                                {r.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {user.accounts.length ? (
              user.accounts.map((acc) => (
                <div
                  key={acc.accountId}
                  className="px-3 py-1 text-xs bg-gray-100 rounded-md border"
                >
                  <p>{acc?.name}</p>
                  {/* {acc.accountId.slice(-6)} */}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No accounts assigned</p>
            )}
          </div>
        )}
      </div>

      {/* ACTIONS */}
      {isEditing && (
        <div className="flex justify-end gap-3 mt-6">
          <button
            disabled={editLoading}
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes {editLoading && <Loader />}
          </button>

          <button
            onClick={handleCancel}
            className="px-4 py-2 border rounded-md text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default TeamDetails;
