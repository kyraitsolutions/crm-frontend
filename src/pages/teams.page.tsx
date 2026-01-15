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
import { USERROLE } from "@/constants/role.constant";
import { ToastMessageService } from "@/services";
import { AccountService } from "@/services/account.service";
import { TeamService } from "@/services/team.service";
import { useAuthStore } from "@/stores";
import { alertManager } from "@/stores/alert.store";
import { TeamsStoreManager, useTeamsStore } from "@/stores/team.store";
import type { ApiError } from "@/types";
import type { ITeam } from "@/types/teams.type";
import { Plus, Trash2 } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";

export const Teams = () => {
  const toastService = new ToastMessageService();
  const teamService = new TeamService();
  const accountService = new AccountService();

  const { user } = useAuthStore((state) => state);

  const teamStoreManager = new TeamsStoreManager();
  const { teams } = useTeamsStore((state) => state);

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
        toastService.success("Team member added successfully");
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
      const response = await teamService.assignAccountToTeamMember({
        id: memberId,
        accountIds: accountIds,
        leadId: "", // provide the lead ID here
      });

      if (response.status === 200) {
        toastService.success("Account assigned successfully");
      }
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

  const fetchAccounts = async () => {
    try {
      const response = await accountService.getAccounts();

      if (response.status === 200) {
        setAccounts(response?.data?.docs);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeams();
  }, []);

  useEffect(() => {
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
          {user?.roleId !== USERROLE.TEAM_MEMBER ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTeamMember(row.userId);
              }}
              className="text-red-600 hover:text-red-800 p-2 rounded-md flex-shrink-0 cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          ) : (
            <span className="text-center inline-block w-full">-</span>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-4">
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
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-medium text-[#37322F]">Teams</h1>

        {teams.length > 0 && (
          <AddNewTeamMemberPopupDialog
            openAddTeamMember={openAddTeamMember}
            setOpenAddTeamMember={setOpenAddTeamMember}
            newTeam={newTeam}
            setNewTeam={setNewTeam}
            isLoadingAddTeamMember={isLoadingAddTeamMember}
            handleAddTeamMember={handleAddTeamMember}
          />
        )}
      </div>

      {teams.length > 0 ? (
        <div className="mt-4">
          <DataTable<ITeam>
            data={teams}
            columns={columns}
            pageSize={20}
            sortable={true}
            paginated={true}
            tableContainerClassName="
          max-h-[calc(100vh-270px)]
          sm:max-h-[calc(100vh-220px)]
          border border-[rgba(50,45,43,0.12)]
          rounded-xl
          shadow-none
        "
            loading={loading}
          />

          {/* Assign Accounts Dialog */}
          <Dialog open={openAssign} onOpenChange={setOpenAssign}>
            <DialogContent
              className="
            sm:max-w-md
            rounded-2xl
            border border-[rgba(50,45,43,0.12)]
            bg-[#FBFAF9]
            shadow-[0px_12px_24px_rgba(55,50,47,0.12)]
          "
            >
              <DialogHeader className="gap-2">
                <DialogTitle className="text-lg font-medium text-[#37322F]">
                  Assign Accounts
                </DialogTitle>
                <DialogDescription className="text-sm text-[#847971]">
                  Select accounts for this team member.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <MultiSelectDropdown
                  value={
                    teams.find((team) => team?.id === selectedTeamId)
                      ?.accountIds
                  }
                  options={accounts.map((a) => ({
                    id: a.id,
                    label: a.accountName,
                  }))}
                  placeholder="Select Accounts"
                  onChange={(value) => setSelectedAccounts(value)}
                />
              </div>

              <DialogFooter className="gap-3">
                <Button
                  variant="outline"
                  className="
                rounded-[99px]
                border-[rgba(50,45,43,0.20)]
                text-[#37322F]
              "
                  onClick={() => setOpenAssign(false)}
                >
                  Cancel
                </Button>

                <Button
                  className="
                rounded-[99px]
                bg-[#37322F]
                text-[#FBFAF9]
                shadow-[0px_2px_4px_rgba(55,50,47,0.12)]
              "
                  onClick={() => {
                    handleAssignAccount(
                      selectedTeamId as string,
                      selectedAccounts
                    );
                    setOpenAssign(false);
                  }}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        /* Empty State */
        <div>
          <div className="flex w-full justify-center items-center h-[75vh]">
            <div
              className="
          flex flex-col max-w-xl w-full items-center gap-6
          p-10 text-center
          rounded-2xl
          border border-dashed border-[rgba(50,45,43,0.20)]
          bg-[rgba(255,255,255,0)]
        "
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(55,50,47,0.08)]">
                <Plus className="h-8 w-8 text-[#37322F]" />
              </div>

              <div>
                <h2 className="text-xl font-medium text-[#37322F]">
                  No team member found
                </h2>
                <p className="mt-2 text-sm text-[#847971]">
                  Add team member for easy management.
                </p>
              </div>

              <AddNewTeamMemberPopupDialog
                openAddTeamMember={openAddTeamMember}
                setOpenAddTeamMember={setOpenAddTeamMember}
                newTeam={newTeam}
                setNewTeam={setNewTeam}
                isLoadingAddTeamMember={isLoadingAddTeamMember}
                handleAddTeamMember={handleAddTeamMember}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AddNewTeamMemberPopupDialog = ({
  openAddTeamMember,
  setOpenAddTeamMember,
  newTeam,
  setNewTeam,
  isLoadingAddTeamMember,
  handleAddTeamMember,
}: any) => {
  return (
    <Dialog
      open={openAddTeamMember}
      onOpenChange={() => setOpenAddTeamMember(!openAddTeamMember)}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpenAddTeamMember(true)}
          className="
        rounded-[99px]
        bg-[#37322F]
        text-[#FBFAF9]
        px-5 py-2
        shadow-[0px_2px_4px_rgba(55,50,47,0.08)]
        hover:bg-[#2e2a28]
        transition
      "
        >
          Add New Team Member
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
      sm:max-w-md
      rounded-2xl
      shadow-none
    "
      >
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-medium text-[#37322F]">
            Add Team Member
          </DialogTitle>
          <DialogDescription className="text-sm text-[#847971]">
            Fill the details below to add a new team member.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault(); // ✅ prevent page reload
            handleAddTeamMember();
          }}
        >
          {/* First Name */}
          <div className="flex flex-col gap-1">
            <Label className="text-sm font-medium text-[#37322F]">
              First Name
            </Label>
            <Input
              value={newTeam.firstName}
              onChange={(e) =>
                setNewTeam({ ...newTeam, firstName: e.target.value })
              }
              required
              placeholder="Enter first name"
              className="
                mt-2
                bg-[#F7F6F4]
                border-none
                rounded-lg
                focus-visible:ring-0
                text-[#37322F]"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col gap-1">
            <Label className="text-sm font-medium text-[#37322F]">
              Last Name
            </Label>
            <Input
              value={newTeam.lastName}
              onChange={(e) =>
                setNewTeam({ ...newTeam, lastName: e.target.value })
              }
              required
              placeholder="Enter last name"
              className="
                mt-2
                bg-[#F7F6F4]
                border-none
                rounded-lg
                focus-visible:ring-0
                text-[#37322F]"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <Label className="text-sm font-medium text-[#37322F]">Email</Label>
            <Input
              type="email"
              value={newTeam.email}
              onChange={(e) =>
                setNewTeam({ ...newTeam, email: e.target.value })
              }
              required
              placeholder="Enter email"
              className="
                mt-2
                bg-[#F7F6F4]
                border-none
                rounded-lg
                focus-visible:ring-0
                text-[#37322F]
          "
            />
          </div>

          {/* Submit Button */}

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              className="
                rounded-[99px]
                border-[rgba(50,45,43,0.20)]
                text-[#37322F]
              "
              onClick={() => setOpenAddTeamMember(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoadingAddTeamMember}
              className="
              rounded-[99px]
              bg-[#37322F]
              text-[#FBFAF9]
              px-5 py-2
              shadow-[0px_2px_4px_rgba(55,50,47,0.08)]
              hover:bg-[#2e2a28]
              disabled:opacity-60
              transition
          "
            >
              Add Member {isLoadingAddTeamMember && <Loader />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
