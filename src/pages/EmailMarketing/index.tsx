import { CampaignSourcesChart } from "@/components/email/CampaignSourcesChart";
import { EmailTrendsChart } from "@/components/email/EmailTrendsChart";
import { EngagementChart } from "@/components/email/EngagementChart";
import { MonthlyPerformanceChart } from "@/components/email/MonthlyPerformanceChart";
import { StatCard } from "@/components/email/StatCard";
import { Users, Mail, MousePointerClick, Eye, Send, FileText, BarChart3, Zap } from "lucide-react";

const stats = [
    { title: "Subscribers", value: "24,521", subtitle: "All time", icon: Users },
    { title: "Sent Today", value: "1,247", subtitle: "+328 this week", icon: Send },
    { title: "Open Rate", value: "42.8%", subtitle: "Avg. rate", icon: Eye },
    { title: "Click Rate", value: "12.4%", subtitle: "Avg. rate", icon: MousePointerClick },
    { title: "Campaigns", value: "18", subtitle: "Active", icon: Mail },
    { title: "Templates", value: "24", subtitle: "Created", icon: FileText },
    { title: "Bounce Rate", value: "2.1%", subtitle: "This month", icon: BarChart3 },
    { title: "Automations", value: "8", subtitle: "Running", icon: Zap },
];

const Index = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* <DashboardSidebar /> */}

            {/* <main className="ml-56"> */}
            {/* <DashboardHeader /> */}

            <div className="p-6 space-y-6">
                {/* Stats Grid - Horizontal Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {stats.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <EmailTrendsChart />
                    </div>
                    <EngagementChart />
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CampaignSourcesChart />
                    <MonthlyPerformanceChart />
                </div>
            </div>
            {/* </main> */}
        </div>
    );
};

export default Index;
