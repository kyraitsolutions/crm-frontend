import { MultiSelectDropdown } from "@/components/common/MultiSelectDropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TeamService } from "@/services/team.service";
import { LocalStorageUtils } from "@/utils";
import { formatDate } from "@/utils/date-utils";
import { useEffect, useState } from "react";

export const Teams = () => {
    const teamService = new TeamService();

    const [teams, setTeams] = useState<any[]>([
        {
            "id": 1,
            "name": "Abhijeet",
            "email": "abhijeet@kyraitsolutions.com",
            "status": "accepted",
            "createdAt": "11-02-2024"
        },
        {
            "id": 2,
            "name": "Abhijeet",
            "email": "abhijeet@kyraitsolutions.com",
            "status": "accepted",
            "createdAt": "11-02-2024"
        },
        {
            "id": 3,
            "name": "Abhijeet",
            "email": "abhijeet@kyraitsolutions.com",
            "status": "pending",
            "createdAt": "11-02-2024"
        },
        {
            "id": 4,
            "name": "Abhijeet",
            "email": "abhijeet@kyraitsolutions.com",
            "status": "accepted",
            "createdAt": "11-02-2024"
        },
        {
            "id": 5,
            "name": "Abhijeet",
            "email": "abhijeet@kyraitsolutions.com",
            "status": "pending",
            "createdAt": "11-02-2024"
        },
    ]);
    const [loading, setLoading] = useState<boolean>(false);


    const getTeams = async () => {
        setLoading(true);
        // fetch teams from api
        try {
            const response = await teamService.getTeamMembers();
            const data = await response.data;
            setTeams(data.docs);
        } catch (error) {
            console.error("Error fetching teams:", error);
        }
        finally {
            setLoading(false);

        }
    }

    useEffect(() => {
        getTeams()
    }, [])


    const [newTeam, setNewTeam] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });

    const handleAddTeamMember = () => {
        try {
            const response = teamService.createTeamMember(newTeam);
            // setTeams([...teams, response?.data.docs]);
        } catch (error) {
            console.log("Error", error)
        }
    };

    const [accounts, setAccounts] = useState<any[]>([]);
    const [openAssign, setOpenAssign] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [selectedAccounts, setSelectedAccounts] = useState([]);

    // const [loading, setLoading] = useState<boolean>(true);

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

    const handleAssignAccount = async (memberId: string, accountIds: string[]) => {
        try {

            const response = await teamService.assignAccountToTeamMember({
                id: memberId,
                accountIds: accountIds,
                leadId: "", // provide the lead ID here
            });
        } catch (error) {
            console.log("Error", error)
        }
    }
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
        <Table>
            <TableCaption>A list of your team members.</TableCaption>
            <TableHeader className="px-6">
                <TableRow >
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Account</TableHead>
                    <TableHead className="">Created At</TableHead>
                    {/* <TableHead className="">Permission</TableHead> */}
                    <TableHead className="">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {teams.map((team) => (
                    <TableRow key={team.id}>
                        <TableCell className="font-medium">{team.firstName + " " + team.lastName}</TableCell>
                        <TableCell>{team.email}</TableCell>
                        <TableCell>
                            {team?.inviteStatus?.toLowerCase() === "accepted" ? (
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
                        </TableCell>
                        <TableCell className="">
                            {/* <MultiSelectDropdown
                                options={accounts.map((a) => ({
                                    id: a.id,
                                    label: a.accountName,
                                }))}
                                placeholder="Select Accounts"
                                onChange={(value) => handleAssignAccount(team.id, value)}
                            /> */}
                            <Badge
                                onClick={() => {
                                    setSelectedTeamId(team.userId);
                                    setSelectedAccounts([]); // reset previous selection
                                    setOpenAssign(true);
                                }}
                                variant="outline"
                                className="text-blue-600 border-blue-500 cursor-pointer"
                            >
                                Assign Accounts
                            </Badge>
                        </TableCell>
                        <TableCell className="">{formatDate(team.createdAt)}</TableCell>
                        {/* <TableCell className="">
                            <Badge
                                onClick={() => handleDeleteAccount(team.id)}
                                variant="outline"
                                className="text-red-600 border-red-500 cursor-pointer"
                            >
                                View
                            </Badge>
                        </TableCell> */}
                        <TableCell className="">
                            {/* add a delete icon to deletet hsi account using shadcn*/}
                            <Badge
                                // onClick={() => handleDeleteAccount(team.id)}
                                variant="outline"
                                className="text-red-600 border-red-500 cursor-pointer"
                            >
                                Delete
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            {/* ADD NEW TEAM MEMBER BUTTON + POPUP */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mt-2">Add New Team Member</Button>
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
                        <Button onClick={handleAddTeamMember}>Add Member</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


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
                            value={teams.find(team => team.userId == selectedTeamId)?.accountIds}
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
                                handleAssignAccount(selectedTeamId, selectedAccounts); // 🔥 API CALL HERE
                                setOpenAssign(false);
                            }}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </Table>

    );
};
