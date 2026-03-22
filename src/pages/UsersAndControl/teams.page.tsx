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
import { isAdmin } from "@/rbac";
import { ToastMessageService } from "@/services";
import { AccountService } from "@/services/account.service";
import { TeamService } from "@/services/team.service";
import { useAuthStore } from "@/stores";
import { alertManager } from "@/stores/alert.store";
import { TeamsStoreManager, useTeamsStore } from "@/stores/team.store";
import type { ApiError } from "@/types";
import type { ITeam } from "@/types/teams.type";
import { ChevronDown, Mail, Pencil, Phone, Plus, Trash2 } from "lucide-react";
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
  const [showMore, setShowMore] = useState(false)

  const is_Admin = isAdmin(user?.roleId);

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
    accountIds: string[],
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
    ...(is_Admin
      ? [
        {
          key: "action",
          header: "Action",
          cellClassName: "whitespace-nowrap text-gray-700",
          render: (row: ITeam) => (
            <div className="flex justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTeamMember(row.userId);
                }}
                className="actions-btn text-red-400!"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ),
        },
      ]
      : []),
  ];

  useEffect(() => {
    getTeams();
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, []);

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

  const userData = {
    id: "u1",
    firstName: "Abhijeet",
    lastName: "Singh",
    initials: "A",
    role: "CEO",
    org: "tst",
    isAdmin: true,
    isSuperAdmin: true,
    addedBy: "Abhijeet Singh",
    addedDate: "Sun, 22 Mar 2026 12:20 PM",
    email: "abhijeetsingh5631@gmail.com",
    phone: "9528295631",
    mobile: "",
    website: "",
    dob: "",
    address: {
      street: "",
      city: "",
      state: "Uttar Pradesh",
      zipCode: "",
      country: "India"
    },
    workspace: [{
      name: "CRM Teamspace",
      code: "CT"
    }],
    locale: {
      language: "English (United States)",
      country: "India",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "12 Hours",
      timeZone: "(GMT 5:30) India Standard Time (Asia/Kolkata)",
      distanceUnit: "Kilometers (km)",
      numberFormat: "1,23,456.789"
    }
  };
  return (
    <div className="">
      {/* Header */}
      {/* <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-medium text-[#37322F]">Teams</h1>

        {teams.length > 0 && is_Admin && (
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
                  isSelectable={is_Admin}
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

              {is_Admin && (
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
                bg-primary
                text-[#FBFAF9]
                shadow-[0px_2px_4px_rgba(55,50,47,0.12)]
              "
                    onClick={() => {
                      handleAssignAccount(
                        selectedTeamId as string,
                        selectedAccounts,
                      );
                      setOpenAssign(false);
                    }}
                  >
                    Save
                  </Button>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
        </div>
      ) : (
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
                <Plus className="h-8 w-8 text-primary" />
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
      )} */}


      <div className="grid grid-cols-5 h-screen bg-white">
        {/* Sidebar - Same as previous */}
        <div className="col-span-2 border-r border-slate-200">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center ">
            <button className="flex items-center gap-1 text-xs font-semibold bg-white border rounded shadow-sm">
              {/* Active Users (1) <ChevronDown className="w-3 h-3" /> */}
            </button>
            <div className="flex">
              <Button className="bg-primary text-white flex items-center gap-1 hover:bg-primary">
                <Plus /> New User
              </Button>
              <Button className="bg-primary text-white rounded-r border-l border-primary hover:bg-primary">
                <ChevronDown color="white" />
              </Button>
            </div>
          </div>


          {teams.map((item) => (
            <div key={item.id} className="bg-blue-50/50 p-4  cursor-pointer">
              <div className="flex gap-3 items-center">
                <div className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg relative">
                  {userData.initials}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-md font-semibold">{item.firstName + " " + item.lastName}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[14px] text-slate-400">{userData.role},</span>
                    <span className="text-[12px] bg-orange-100 text-orange-700 px-2 py-1 rounded ">Administrator</span>
                  </div>
                  <span className="text-[12px] text-slate-500 mt-0.5 tracking-wide">{item.email}</span>
                </div>
              </div>
            </div>
          ))}

        </div>


        <main className="col-span-3 flex-1 overflow-y-auto p-10">
          {/* Header Profile Section */}
          <header className="flex items-start gap-6 mb-5">
            <div className="w-24 h-24 aspect-square bg-orange-500 text-white rounded-full flex items-center justify-center text-4xl font-semibold shadow-lg">
              {userData.initials}
            </div>
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-800">{userData.firstName}</h2>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold border border-orange-200">
                  Administrator
                </span>
                <Pencil className="w-3 h-3 text-slate-400 cursor-pointer hover:text-blue-500" />
              </div>
              <p className="text-sm text-slate-400">{userData.role} at <span className="text-slate-500">{userData.org}</span></p>
              <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" /> {userData.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" /> {userData.phone}
                </div>
              </div>
            </div>
          </header>

          <button onClick={() => setShowMore(!showMore)} className="flex items-center gap-1 text-orange-500 text-sm font-semibold mb-5 hover:underline">
            Show Details <ChevronDown className="w-4 h-4" />
          </button>


          {/* Info Grid Sections */}
          <div className="max-w-3xl space-y-12 mt-4">
            {showMore && <section className="border-b border-slate-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-primary">User Information</h2>
                {/* <Pencil size={14} className="text-slate-400 cursor-pointer" /> */}
              </div>
              <div className="space-y-1">
                <InfoRow label="First Name" value={userData.firstName} />
                <InfoRow label="Last Name" value={userData.lastName} />
                <InfoRow label="Email" value={userData.email} />
                <InfoRow label="Role" value={userData.role} />
                <InfoRow label="Profile" value={userData.isSuperAdmin ? "administrator" : ""} />
                <div className="grid grid-cols-[200px_1fr] py-2 text-[13px]">
                  <span className="text-slate-400 text-right pr-10">Added By</span>
                  <span className="text-slate-700 font-medium">
                    {userData.addedBy} <span className="text-slate-400 font-normal ml-2">{userData.addedDate}</span>
                  </span>
                </div>
                <InfoRow label="Phone" value={userData.phone} />
                <InfoRow label="Mobile" value={userData.mobile} />
                <InfoRow label="Website" value={userData.website} />
                <InfoRow label="Date of Birth" value={userData.dob} />
              </div>
            </section>}
            {showMore && <section className="border-b border-slate-50">
              <h2 className="text-base font-bold text-primary mb-4">Address Information</h2>
              <div className="space-y-1">
                <InfoRow label="Street" value={userData.address.street} />
                <InfoRow label="City" value={userData.address.city} />
                <InfoRow label="State" value={userData.address.state} />
                <InfoRow label="Zip Code" value={userData.address.zipCode} />
                <InfoRow label="Country" value={userData.address.country} />
              </div>
            </section>}
            {/* Teamspace */}
            <section>
              <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">Workspace Information</h3>
              <div className="flex items-center">
                <span className="w-48 text-sm text-slate-400 text-right pr-8">Associated To</span>
                <div className="flex items-center gap-2">
                  <div className="bg-pink-600 text-white px-2 py-1 rounded text-xs font-bold uppercase">{userData.workspace[0].code}</div>
                  <span className="text-sm font-medium text-slate-700">{userData.workspace[0].name}</span>
                </div>
              </div>
            </section>

            {/* Locale Information */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-bold text-sm uppercase tracking-wider">Locale Information</h3>
                <Pencil className="w-3 h-3 text-slate-400 cursor-pointer" />
              </div>
              <div className="space-y-4">
                {[
                  ["Language", userData.locale.language],
                  ["Country Locale", userData.locale.country],
                  ["Date Format", userData.locale.dateFormat],
                  ["Time Format", userData.locale.timeFormat],
                  ["Time Zone", userData.locale.timeZone],
                  ["Preferred Unit for Distance", userData.locale.distanceUnit],
                  ["Number Format", userData.locale.numberFormat],
                ].map(([label, value]) => (
                  <div key={label} className="flex">
                    <span className="w-48 text-sm whitespace-nowrap text-slate-400 text-right pr-8">{label}</span>
                    <span className="text-sm text-slate-700 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="grid grid-cols-[200px_1fr] py-2 text-sm">
    <span className="text-slate-400 text-right pr-10">{label}</span>
    <span className="text-slate-700 font-medium">{value || ""}</span>
  </div>
);
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
        bg-primary
        text-[#FBFAF9]
        px-5 py-2
        shadow-[0px_2px_4px_rgba(55,50,47,0.08)]
        hover:bg-primary/90
        transition
      "
        >
          + Add New Team Member
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
              bg-primary
              text-[#FBFAF9]
              px-5 py-2
              shadow-[0px_2px_4px_rgba(55,50,47,0.08)]
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


{/* Main Detail Pane */ }
// <div className="flex-1 overflow-y-auto bg-white">
//   <header className="flex items-start gap-6 mb-12">
//     <div className="w-24 h-24 bg-orange-500 text-white rounded-full flex items-center justify-center text-4xl font-semibold shadow-lg">
//       {userData.initials}
//     </div>
//     <div className="space-y-2 mt-2">
//       <div className="flex items-center gap-3">
//         <h2 className="text-xl font-bold text-slate-800">{userData.firstName}</h2>
//         <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold border border-orange-200">
//           Administrator
//         </span>
//         <Pencil className="w-3 h-3 text-slate-400 cursor-pointer hover:text-blue-500" />
//       </div>
//       <p className="text-sm text-slate-400">{userData.role} at <span className="text-slate-500">{userData.org}</span></p>
//       <div className="flex gap-6 mt-4">
//         <div className="flex items-center gap-2 text-sm text-slate-600">
//           <Mail className="w-4 h-4 text-slate-400" /> {userData.email}
//         </div>
//         <div className="flex items-center gap-2 text-sm text-slate-600">
//           <Phone className="w-4 h-4 text-slate-400" /> {userData.phone}
//         </div>
//       </div>
//     </div>
//   </header>
//   <section className="p-10 border-b border-slate-50">
//     <div className="flex items-center justify-between mb-8">
//       <h2 className="text-base font-bold text-slate-800">User Information</h2>
//       <Pencil size={14} className="text-slate-400 cursor-pointer" />
//     </div>

//     <div className="space-y-1">
//       <InfoRow label="First Name" value={userData.firstName} />
//       <InfoRow label="Last Name" value={userData.lastName} />
//       <InfoRow label="Email" value={userData.email} />
//       <InfoRow label="Role" value={userData.role} />
//       <InfoRow label="Profile" value={userData.isSuperAdmin ? "administrator" : ""} />
//       <div className="grid grid-cols-[200px_1fr] py-2 text-[13px]">
//         <span className="text-slate-400 text-right pr-10">Added By</span>
//         <span className="text-slate-700 font-medium">
//           {userData.addedBy} <span className="text-slate-400 font-normal ml-2">{userData.addedDate}</span>
//         </span>
//       </div>
//       <InfoRow label="Phone" value={userData.phone} />
//       <InfoRow label="Mobile" value={userData.mobile} />
//       <InfoRow label="Website" value={userData.website} />
//       <InfoRow label="Date of Birth" value={userData.dob} />
//     </div>
//   </section>

//   <section className="p-10 border-b border-slate-50">
//     <h2 className="text-base font-bold text-slate-800 mb-8">Address Information</h2>
//     <div className="space-y-1">
//       <InfoRow label="Street" value={userData.address.street} />
//       <InfoRow label="City" value={userData.address.city} />
//       <InfoRow label="State" value={userData.address.state} />
//       <InfoRow label="Zip Code" value={userData.address.zipCode} />
//       <InfoRow label="Country" value={userData.address.country} />
//     </div>
//   </section>
//   <section className="p-10">
//     <div className="flex items-center gap-2 mb-8">
//       <h2 className="text-base font-bold text-slate-800">Locale Information</h2>
//       <Pencil size={14} className="text-slate-400 cursor-pointer" />
//     </div>
//     <div className="space-y-1">
//       <InfoRow label="Language" value="English (United States)" />
//       <InfoRow label="Time Zone" value="(GMT 5:30) India Standard Time" />
//     </div>
//   </section>
// </div>