import { DataTable, type Column } from "@/components/common";
import { MultiSelectDropdown } from "@/components/common/MultiSelectDropdown";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastMessageService } from "@/services";
import { TeamService } from "@/services/team.service";
import { alertManager } from "@/stores/alert.store";
import { TeamsStoreManager, useTeamsStore } from "@/stores/team.store";
import type { ApiError } from "@/types";
import type { ITeam } from "@/types/teams.type";
import { LocalStorageUtils } from "@/utils";
import { Trash2 } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";

export const Teams = () => {
  const toastService = new ToastMessageService();
  const teamStoreManager = new TeamsStoreManager();
  const teamService = new TeamService();
  const { teams } = useTeamsStore((state) => state);

  console.log(teams);

  const [openAddTeamMember, setOpenAddTeamMember] = useState(false);

  //   const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadingAddTeamMember, setIsLoadingAddTeamMember] =
    useState<boolean>(false);

  const [newTeam, setNewTeam] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [accounts, setAccounts] = useState<any[]>([]);
  const [openAssign, setOpenAssign] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<string[] | []>([]);

  const handleAddTeamMember = async () => {
    setIsLoadingAddTeamMember(true);
    try {
      const response = await teamService.createTeamMember(newTeam);

      if (response.status === 200) {
        teamStoreManager.setTeamsTop(response?.data?.docs);
        setOpenAddTeamMember(false);
      }
    } catch (error) {
      const err = error as ApiError;
      if (err) {
        toastService.apiError(err.message);
      }
    } finally {
      setIsLoadingAddTeamMember(false);
    }
  };
  const getTeams = async () => {
    setLoading(true);
    // fetch teams from api
    try {
      const response = await teamService.getTeamMembers();
      const data = await response.data;
      console.log(data);
      teamStoreManager.setTeams(data.docs);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignAccount = async (
    memberId: string,
    accountIds: string[]
  ) => {
    try {
      await teamService.assignAccountToTeamMember({
        id: memberId,
        accountIds: accountIds,
        leadId: "", // provide the lead ID here
      });
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleDeleteTeamMember = (memberId: string) => {
    alertManager.show({
      type: "warning",
      title: "Delete Account",
      message: "Are you sure you want to delete this account?",
      onConfirm: () => {
        handleDeleteTeamMemberByMemberId(memberId);
      },
    });
  };

  const handleDeleteTeamMemberByMemberId = async (memberId: string) => {
    const rollback = teamStoreManager.deleteTeamOptimistic(memberId);
    try {
      const response = await teamService.deleteTeamMember(memberId);

      if (response.status === 200) {
        toastService.success("Account deleted successfully");
      }
    } catch (error) {
      console.log("Error deleting account:", error);
      rollback();
    }
  };

  useEffect(() => {
    getTeams();
  }, []);

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
        setAccounts(data.result.docs);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const columns: Column<ITeam>[] = [
    {
      key: "name",
      header: "Name",
      className: "min-w-[200px]",

      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.firstName + " " + row.lastName}
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      className: "min-w-[200px]",

      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.email}</div>
        </div>
      ),
    },
    {
      key: "roleName",
      header: "Role",
      className: "min-w-[200px]",

      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.roleName}</div>
        </div>
      ),
    },
    {
      key: "inviteStatus",
      header: "Invite",
      className: "min-w-[200px]",

      render: (row) => (
        <div>
          {/* <div className="font-medium text-gray-900">{row.inviteStatus}</div> */}
          {row?.inviteStatus?.toLowerCase() === "accepted" ? (
            <Badge
              variant="outline"
              className="text-green-600 border-green-500 cursor-pointer"
            >
              Accepted
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-red-600 border-red-500 cursor-pointer"
            >
              Pending
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "accountIds",
      header: "Assigned Accounts",
      className: "min-w-[200px]",

      render: (row) => (
        <div>
          <Badge
            onClick={() => {
              setSelectedTeamId(row.id);
              setSelectedAccounts([]); // reset previous selection
              setOpenAssign(true);
            }}
            variant="outline"
            className="text-blue-600 border-blue-500 cursor-pointer"
          >
            Assign Accounts
          </Badge>
        </div>
      ),
    },
    // {
    //   key: "status",
    //   header: "Status",
    //   cellClassName: "whitespace-nowrap text-gray-700",
    //   render: (row) => (
    //     <div>
    //       <Switch
    //         checked={row.status}
    //         className="cursor-pointer"
    //         // onClick={(e) => handleUpdateStatus(e, row.id)}
    //       />
    //     </div>
    //   ),
    // },
    {
      key: "createdDisplay",
      header: "Created",
      cellClassName: "whitespace-nowrap text-gray-700",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">
            {moment(row.createdAt).format("DD-MM-YYYY")}
          </div>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      cellClassName: "whitespace-nowrap text-gray-700",
      render: (row) => (
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTeamMember(row.userId);
            }}
            className="text-red-600 hover:text-red-800 p-2 rounded-md flex-shrink-0 cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Teams</h1>
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
    <div className="p-3">
      {/* ADD NEW TEAM MEMBER BUTTON + POPUP */}

      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Teams
        </h1>

        <div>
          <Dialog
            open={openAddTeamMember}
            onOpenChange={() => setOpenAddTeamMember(!openAddTeamMember)}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setOpenAddTeamMember(true)}>
                Add New Team Member
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>
                  Fill the details below to add a new team member.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label>First Name</Label>
                  <Input
                    value={newTeam.firstName}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, firstName: e.target.value })
                    }
                    placeholder="Enter first name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Last Name</Label>
                  <Input
                    value={newTeam.lastName}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, lastName: e.target.value })
                    }
                    placeholder="Enter last name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newTeam.email}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, email: e.target.value })
                    }
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  disabled={isLoadingAddTeamMember}
                  onClick={handleAddTeamMember}
                >
                  Add Member {isLoadingAddTeamMember && <Loader />}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-2">
        <DataTable<ITeam>
          data={teams}
          columns={columns}
          pageSize={20}
          sortable={true}
          paginated={true}
          tableContainerClassName="max-h-[calc(100vh-270px)] sm:max-h-[calc(100vh-220px)] shadow-none"
          loading={loading}
        />

        {/* Open assigned account dialong */}
        <Dialog open={openAssign} onOpenChange={setOpenAssign}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Accounts</DialogTitle>
              <DialogDescription>
                Select accounts for this team member.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <MultiSelectDropdown
                value={
                  teams.find((team) => team?.userId == selectedTeamId)
                    ?.accountIds
                }
                options={accounts.map((a) => ({
                  id: a.id,
                  label: a.accountName,
                }))}
                placeholder="Select Accounts"
                // ❗ Only update local state (no API call)
                onChange={(value) => setSelectedAccounts(value)}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenAssign(false)}>
                Cancel
              </Button>

              <Button
                onClick={() => {
                  handleAssignAccount(
                    selectedTeamId as string,
                    selectedAccounts
                  ); // 🔥 API CALL HERE
                  setOpenAssign(false);
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
