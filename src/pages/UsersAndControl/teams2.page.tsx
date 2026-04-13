import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

import CreateTeamMemberModal from "@/components/modal/CreateTeamMemberModal";
import { ToastMessageService } from "@/services";
import { RBACService } from "@/services/rbac.service";
import { TeamService } from "@/services/team.service";
import { useAuthStore } from "@/stores";
import { useAccountsStore } from "@/stores/accounts.store";
import { TeamsStoreManager, useTeamsStore } from "@/stores/team.store";
import type { ApiError } from "@/types";
import AddTeamMemberDialog from "./components/AddTeamMemberDialog";
import TeamDetails from "./components/TeamDetails";
import TeamList from "./components/TeamList";
import type { TRole } from "./role.page";
import { hasPermission } from "@/rbac";
import type { ITeam } from "@/types/teams.type";

const Teams = () => {
  const roleService = new RBACService();
  const teamService = new TeamService();
  const toast = new ToastMessageService();
  const teamStoreManager = new TeamsStoreManager();

  const { teams } = useTeamsStore((state) => state);
  const { accounts } = useAccountsStore((state) => state);
  const { user } = useAuthStore((state) => state);

  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ITeam | null>(null);
  const [roles, setRoles] = useState<TRole[]>([]);
  const [openAdd, setOpenAdd] = useState(false);

  const handleCreate = async (data: any) => {
    setAddLoading(true);
    try {
      const res = await teamService.createTeamMember(data);

      if (res.status === 200) {
        const newTeamMember = res.data.doc;

        // const memberPayload = {
        //   accounts: newTeamMember?.accounts,
        //   userProfile: {
        //     firstName: newTeamMember?.firstName,
        //     lastName: newTeamMember?.lastName,
        //   },
        //   email: newTeamMember?.email,
        //   role: newTeamMember?.role,
        //   id: newTeamMember?.id,
        //   userId: newTeamMember?.userId,
        //   createdAt: newTeamMember?.createdAt,
        //   updatedAt: newTeamMember?.updatedAt,
        // };
        teamStoreManager.setTeamsTop(newTeamMember);

        toast.apiSuccess(res.message || "Team member created successfully");
        setOpenAdd(false);
      }
    } catch (error) {
      console.log(error);
      const err = error as ApiError;
      console.log(err);
      toast.apiError(err.message || "Failed to create team member");
    } finally {
      setAddLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    setEditLoading(true);
    const optimisticDataPayload = {
      ...data,
      userProfile: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
      email: data.email,
      userId: data.userId,
    };
    const rollback = teamStoreManager.updateTeamOptimistic(
      optimisticDataPayload,
    );
    try {
      const response = await teamService.updateTeamMember(data);
      if (response.status === 200) {
        toast.apiSuccess(
          response.message || "Team member updated successfully",
        );
      }
    } catch (error) {
      const err = error as ApiError;
      toast.apiError(err.message || "Failed to update team member");
      rollback();
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteTeamMemberByMemberId = async (membersIds: string[]) => {
    const rollback = teamStoreManager.deleteTeamOptimistic(membersIds);
    try {
      const response = await teamService.deleteTeamMember(membersIds);
      if (response.status === 200) {
        toast.success(response?.message || "Account deleted successfully");
      }
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message || "Failed to delete account");
      rollback();
    }
  };

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await teamService.getTeamMembers();
      teamStoreManager.setTeams(res.data.docs);

      if (res.data.docs.length > 0) {
        setSelectedUser(res.data.docs[0]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await roleService.getRoles();

      if (response.status === 200) {
        setRoles(response.data.docs);
      }
    } catch (error) {
      console.error("Error fetching roles", error);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchRoles();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-6 space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      {!teams || teams.length === 0 ? (
        <CreateTeamMemberModal onCreate={() => setOpenAdd(true)} />
      ) : (
        <div className="grid grid-cols-2 gap-4 bg-white">
          {/* LEFT SIDE */}
          <div className="border-r">
            <div className="flex justify-between items-center p-4">
              <h2 className="font-semibold">Team Members</h2>

              {hasPermission(user?.permissions, "teams.create") && (
                <Button onClick={() => setOpenAdd(true)} className="rounded-xl">
                  <Plus size={16} /> New User
                </Button>
              )}
            </div>

            <TeamList
              teams={teams}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              permissions={user?.permissions}
              onDeleteSelected={(ids) => handleDeleteTeamMemberByMemberId(ids)}
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="p-4">
            {selectedUser ? (
              <TeamDetails
                user={selectedUser}
                accounts={accounts || []}
                roles={roles || []}
                level={user?.role?.level || 0}
                onUpdate={handleUpdate}
                editLoading={editLoading}
              />
            ) : (
              <p>Select user</p>
            )}
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {hasPermission(user?.permissions, "teams.create") && (
        <AddTeamMemberDialog
          open={openAdd}
          setOpen={setOpenAdd}
          onSubmit={handleCreate}
          accounts={accounts || []}
          loading={addLoading}
          roles={roles || []}
          level={user?.role?.level}
        />
      )}
    </React.Fragment>
  );
};

export default Teams;
