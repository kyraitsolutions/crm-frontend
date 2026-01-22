import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Mail, Eye, MousePointer } from "lucide-react";
import { Button } from "@/components/ui/button";

const campaigns = [
    {
        id: 1,
        name: "Summer Sale Announcement",
        status: "sent",
        sent: "12,450",
        openRate: "42.3%",
        clickRate: "8.7%",
        date: "Jan 15, 2026",
    },
    {
        id: 2,
        name: "New Product Launch",
        status: "sent",
        sent: "8,320",
        openRate: "38.9%",
        clickRate: "12.4%",
        date: "Jan 12, 2026",
    },
    {
        id: 3,
        name: "Weekly Newsletter #47",
        status: "draft",
        sent: "-",
        openRate: "-",
        clickRate: "-",
        date: "Jan 18, 2026",
    },
    {
        id: 4,
        name: "Customer Feedback Request",
        status: "scheduled",
        sent: "-",
        openRate: "-",
        clickRate: "-",
        date: "Jan 20, 2026",
    },
    {
        id: 5,
        name: "Holiday Greetings",
        status: "sent",
        sent: "15,780",
        openRate: "51.2%",
        clickRate: "6.3%",
        date: "Dec 24, 2025",
    },
];

const statusStyles = {
    sent: "bg-success/10 text-success border-success/20",
    draft: "bg-muted text-muted-foreground border-muted-foreground/20",
    scheduled: "bg-warning/10 text-warning border-warning/20",
};

export const RecentCampaigns = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-xl bg-card p-6 shadow-md border border-border/50"
        >
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-display font-semibold text-foreground">Recent Campaigns</h3>
                    <p className="text-sm text-muted-foreground">Your latest email campaigns</p>
                </div>
                <Button variant="outline" size="sm" className="text-sm">
                    View All
                </Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Campaign
                            </th>
                            <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Status
                            </th>
                            <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    Sent
                                </div>
                            </th>
                            <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    Open Rate
                                </div>
                            </th>
                            <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <MousePointer className="h-3 w-3" />
                                    Click Rate
                                </div>
                            </th>
                            <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Date
                            </th>
                            <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {campaigns.map((campaign, index) => (
                            <motion.tr
                                key={campaign.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                                className="group hover:bg-muted/30 transition-colors"
                            >
                                <td className="py-4">
                                    <span className="font-medium text-foreground">{campaign.name}</span>
                                </td>
                                <td className="py-4">
                                    <Badge
                                        variant="outline"
                                        className={statusStyles[campaign.status as keyof typeof statusStyles]}
                                    >
                                        {campaign.status}
                                    </Badge>
                                </td>
                                <td className="py-4 text-sm text-muted-foreground">{campaign.sent}</td>
                                <td className="py-4 text-sm text-muted-foreground">{campaign.openRate}</td>
                                <td className="py-4 text-sm text-muted-foreground">{campaign.clickRate}</td>
                                <td className="py-4 text-sm text-muted-foreground">{campaign.date}</td>
                                <td className="py-4 text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};
