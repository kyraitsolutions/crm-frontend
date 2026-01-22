import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";

const Subscribers = () => {
    const subscribers = [
        {
            id: 1,
            name: "Abhijeet",
            email: "abhijeet@gmail.com",
            status: "subscribed",
            source: "Chatbot",
            tags: ["Hotel", "Warm"],
            lastActivity: "2 days ago",
        },
        {
            id: 1,
            name: "Abhijeet",
            email: "abhijeet@gmail.com",
            status: "subscribed",
            source: "Chatbot",
            tags: ["Hotel", "Warm"],
            lastActivity: "2 days ago",
        },
        {
            id: 1,
            name: "Abhijeet",
            email: "abhijeet@gmail.com",
            status: "subscribed",
            source: "Chatbot",
            tags: ["Hotel", "Warm"],
            lastActivity: "2 days ago",
        },
        {
            id: 1,
            name: "Abhijeet",
            email: "abhijeet@gmail.com",
            status: "subscribed",
            source: "Chatbot",
            tags: ["Hotel", "Warm"],
            lastActivity: "2 days ago",
        },
        {
            id: 1,
            name: "Abhijeet",
            email: "abhijeet@gmail.com",
            status: "subscribed",
            source: "Chatbot",
            tags: ["Hotel", "Warm"],
            lastActivity: "2 days ago",
        },
        {
            id: 1,
            name: "Abhijeet",
            email: "abhijeet@gmail.com",
            status: "subscribed",
            source: "Chatbot",
            tags: ["Hotel", "Warm"],
            lastActivity: "2 days ago",
        },
        {
            id: 1,
            name: "Abhijeet",
            email: "abhijeet@gmail.com",
            status: "subscribed",
            source: "Chatbot",
            tags: ["Hotel", "Warm"],
            lastActivity: "2 days ago",
        },
        {
            id: 1,
            name: "Abhijeet",
            email: "abhijeet@gmail.com",
            status: "subscribed",
            source: "Chatbot",
            tags: ["Hotel", "Warm"],
            lastActivity: "2 days ago",
        },
        {
            id: 1,
            name: "Abhijeet",
            email: "abhijeet@gmail.com",
            status: "subscribed",
            source: "Chatbot",
            tags: ["Hotel", "Warm"],
            lastActivity: "2 days ago",
        },
    ];

    const statusColor = {
        subscribed: "bg-green-100 text-green-700",
        unsubscribed: "bg-gray-100 text-gray-600",
        bounced: "bg-red-100 text-red-700",
    } as const;
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Subscribers</h2>

                <div className="flex whitespace-normal items-center gap-6">
                    {/* Primary action */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className=""
                            >
                                <Plus className="h-4 w-4" />
                                Add Subscriber
                                <ChevronDown className="h-4 w-4 opacity-70" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-lg shadow-sm px-3 bg-white mt-2 text-sm py-2">
                            <DropdownMenuItem className="py-1 cursor-pointer">Add single subscriber</DropdownMenuItem>
                            <DropdownMenuItem className="py-1 cursor-pointer">Import subscriber</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>

            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted text-muted-foreground">
                        <tr>
                            <th className="p-3 text-left">
                                <input type="checkbox" />
                            </th>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Tags</th>
                            <th className="p-3 text-left">Source</th>
                            <th className="p-3 text-left">Last Activity</th>
                            {/* <th className="p-3 text-right">Actions</th> */}
                        </tr>
                    </thead>

                    <tbody>
                        {subscribers.map((sub) => (
                            <tr key={sub.id} className="border-t">
                                <td className="p-3">
                                    <input type="checkbox" />
                                </td>
                                <td className="p-3 font-medium">{sub.name}</td>
                                <td className="p-3">{sub.email}</td>
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[sub.status as keyof typeof statusColor]}`}
                                    >
                                        {sub.status}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <div className="flex gap-1 flex-wrap">
                                        {sub.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="bg-muted px-2 py-0.5 rounded text-xs"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-3">{sub.source}</td>
                                <td className="p-3 text-muted-foreground">
                                    {sub.lastActivity}
                                </td>
                                {/* <td className="p-3 text-right">
                                    <button className="text-primary text-sm">View</button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Subscribers