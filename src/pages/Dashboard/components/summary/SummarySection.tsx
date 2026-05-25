import { useDashboardStore } from "../../store/dashboard.store";
import DashboardSummaryCard from "./SummaryCard";

import { MessageSquare, TrendingUp, UserPlus } from "lucide-react";

export const SUMMARY_CARDS = [
  {
    id: "new_leads",
    title: "New Leads",
    value: "128",
    percentage: "+18%",
    description: "vs last 7 days",
    icon: UserPlus,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    lineColor: "bg-green-500",
  },

  {
    id: "open_conversations",
    title: "Open Conversations",
    value: "42",
    percentage: "+12%",
    description: "vs last 7 days",
    icon: MessageSquare,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    lineColor: "bg-blue-500",
  },

  {
    id: "conversion_rate",
    title: "Conversion Rate",
    value: "24.6%",
    percentage: "+7%",
    description: "vs last 7 days",
    icon: TrendingUp,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    lineColor: "bg-violet-500",
  },
];

const DashboardSummarySection = () => {
  const { dashboardOverview, filters } = useDashboardStore((state) => state);

  return (
    <div
      className={`flex flex-wrap gap-3 ${dashboardOverview?.summary?.length > 4 ? "lg:grid-cols-5 md:grid-cols-3" : "md:grid-cols-3"}`}
    >
      {dashboardOverview?.summary &&
        dashboardOverview?.summary.length > 0 &&
        dashboardOverview?.summary?.map((card: any) => (
          <DashboardSummaryCard key={card.id} card={card} filters={filters} />
        ))}
    </div>
  );
};

export default DashboardSummarySection;
