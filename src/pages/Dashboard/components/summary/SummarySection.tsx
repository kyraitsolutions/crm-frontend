import { useDashboardStore } from "../../store/dashboard.store";
import DashboardSummaryCard from "./SummaryCard";

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
