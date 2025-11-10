import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
import { useState } from "react";

export const Teams = () => {
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
                    <TableHead className="">Created At</TableHead>
                    <TableHead className="">Permission</TableHead>
                    <TableHead className="">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {teams.map((team) => (
                    <TableRow key={team.id}>
                        <TableCell className="font-medium">{team.name}</TableCell>
                        <TableCell>{team.email}</TableCell>
                        <TableCell>
                            {team.status === "accepted" ? (
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
                        <TableCell className="">{team.createdAt}</TableCell>
                        <TableCell className="">
                            {/* add a delete icon to deletet hsi account using shadcn*/}
                            <Badge
                                // onClick={() => handleDeleteAccount(team.id)}
                                variant="outline"
                                className="text-red-600 border-red-500 cursor-pointer"
                            >
                                View
                            </Badge>
                        </TableCell>
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
        </Table>

    );
};
