import type { ITeam } from "@/types/teams.type";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, User2 } from "lucide-react";
import { alertManager } from "@/stores/alert.store";
import { hasPermission, ROLES } from "@/rbac";
import ConfirmModal from "@/components/confirm";

type TeamListProps = {
  teams: ITeam[];
  selectedUser: ITeam | null;
  setSelectedUser: (user: ITeam) => void;
  onDeleteSelected?: (ids: string[]) => void;
  onStatusChange?: (member: ITeam, active: boolean) => void | Promise<void>;
  permissions?: string[];
  currentUserId?: string;
};

const TeamList = ({
  teams,
  selectedUser,
  permissions = [],
  setSelectedUser,
  onDeleteSelected,
  onStatusChange,
  currentUserId,
}: TeamListProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [pendingDeactivate, setPendingDeactivate] = useState<ITeam | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // ✅ filter logic
  const filteredTeams = useMemo(() => {
    if (!search.trim()) return teams;

    const term = search.toLowerCase();

    return teams.filter((t) => {
      return (
        t?.userProfile?.firstName?.toLowerCase().includes(term) ||
        t?.userProfile?.lastName?.toLowerCase().includes(term) ||
        t.email?.toLowerCase().includes(term)
      );
    });
  }, [teams, search]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredTeams.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTeams.map((t) => t.userId));
    }
  };

  const handleDelete = () => {
    alertManager.show({
      type: "warning",
      title: "Delete Account",
      message: "Are you sure you want to delete this account?",
      onConfirm: () => {
        onDeleteSelected?.(selectedIds);
        setSelectedIds([]);
      },
    });
  };

  return (
    <div className="border rounded-2xl overflow-hidden bg-white">
      {/* 🔍 SEARCH */}
      <div className="p-3 border-b bg-white">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSelectedIds([]);
            setSearch(e.target.value);
          }}
          className="input-field"
        />
      </div>

      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 p-3 border-b bg-gray-50">
        {filteredTeams?.length > 0 && (
          <div className="bg-gray-200 px-3 py-1 rounded-2xl">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              Total Users
              <span className=" size-6 rounded-full flex justify-center items-center bg-slate-700 text-white text-[10px] font-bold">
                {filteredTeams.length.toString().padStart(2, "0")}
              </span>
            </p>
          </div>
        )}

        {hasPermission(permissions, "teams.delete") && (
          <div className="flex items-center gap-4">
            {filteredTeams?.length > 1 && (
              <label className="flex items-center gap-1 text-sm cursor-pointer font-medium">
                <Input
                  type="checkbox"
                  className="size-3"
                  checked={
                    filteredTeams.length > 0 &&
                    selectedIds.length === filteredTeams.length
                  }
                  onChange={handleSelectAll}
                />
                Select All
              </label>
            )}

            {selectedIds?.length > 0 && (
              <Button
                variant="destructive"
                className="rounded-xl px-4 py-2"
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 /> Delete ({selectedIds.length})
              </Button>
            )}
          </div>
        )}
      </div>

      {/* LIST */}
      {filteredTeams?.length === 0 ? (
        <div className="p-6 text-center text-sm text-gray-400 flex flex-col items-center gap-1 font-medium">
          <User2 /> No users found!
        </div>
      ) : (
        filteredTeams?.length > 0 &&
        filteredTeams?.map((item) => {
          const isChecked = selectedIds.includes(item?.userId);
          const isOwner = item?.role?.name === ROLES.OWNER;

          return (
            <div
              key={item?.id}
              className={`flex items-center justify-between p-4 hover:bg-gray-50 ${selectedUser?.id === item?.id ? "bg-blue-50" : ""
                }`}
            >
              {/* LEFT */}
              <div
                onClick={() => setSelectedUser(item)}
                className="flex gap-3 items-center cursor-pointer flex-1"
              >
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center">
                  {item?.userProfile?.firstName &&
                    item?.userProfile?.firstName.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="font-medium">
                    {item?.userProfile?.firstName} {item?.userProfile?.lastName}
                  </p>
                  <p className="text-xs text-slate-400">{item?.email}</p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">
                {hasPermission(permissions, "teams.edit") &&
                  !isOwner &&
                  item.userId !== currentUserId && (
                    <Button
                      type="button"
                      role="switch"
                      aria-checked={item.status !== false}
                      title={item.status !== false ? "Active" : "Inactive"}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (item.status !== false) {
                          setPendingDeactivate(item);
                          return;
                        }
                        void onStatusChange?.(item, true);
                      }}
                      className={`relative h-5 w-9 shrink-0 rounded-full transition ${item.status !== false ? "bg-primary" : "bg-gray-300"}`}
                    >
                      <span
                        className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition ${
                          item.status !== false ? "left-4.5" : "left-0.5"
                        }`}
                      />
                    </Button>
                  )}

                {hasPermission(permissions, "teams.delete") && !isOwner && (
                  <input
                    disabled={isOwner}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSelect(item?.userId)}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
          );
        })
      )}

      <ConfirmModal
        isOpen={!!pendingDeactivate}
        title="Deactivate user"
        description={
          pendingDeactivate
            ? `${pendingDeactivate.userProfile?.firstName || "This user"} will still be able to sign in, but they will see a notice that their account is deactivated until an admin turns it back on.`
            : ""
        }
        confirmText="Deactivate"
        cancelText="Cancel"
        loading={statusLoading}
        className=" mx-auto mt-2"
        onCancel={() => {
          if (statusLoading) return;
          setPendingDeactivate(null);
        }}
        onConfirm={async () => {
          if (!pendingDeactivate) return;
          setStatusLoading(true);
          try {
            await onStatusChange?.(pendingDeactivate, false);
            setPendingDeactivate(null);
          } finally {
            setStatusLoading(false);
          }
        }}
      />
    </div>
  );
};

export default TeamList;
