// components/charts/DashboardChartsSection.tsx

import LeadsBySourceChart from "./LeadsBySourceChart";
import LeadsOverTimeChart from "./LeadsOverTimeChart";
import LeadsByStatusChart from "./LeadsByStatusChart";
import { useDashboardStore } from "@/pages/Dashboard/store/dashboard.store";

const DashboardChartsSection = () => {
  const { dashboardOverview } = useDashboardStore((state) => state);
  const data = dashboardOverview?.charts;

  if (!data) return null;
  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      <div className="last:md:col-span-2 last:xl:col-span-1">
        <LeadsBySourceChart data={data?.leadsBySource} />
      </div>

      <div className="last:md:col-span-2 last:xl:col-span-1 h-full">
        <LeadsOverTimeChart data={data?.leadsOverTime} />
      </div>

      <div className="last:md:col-span-2 last:xl:col-span-1 h-full">
        <LeadsByStatusChart data={data?.leadsByStatus} />
      </div>
    </section>
    // <section className="grid grid-cols-1 gap-3 xl:grid-cols-3 md:grid-cols-2">
    //   <LeadsBySourceChart data={data?.leadsBySource} />
    //   <LeadsOverTimeChart data={data?.leadsOverTime} />
    //   <LeadsByStatusChart data={data?.leadsByStatus} />
    // </section>
  );
};

export default DashboardChartsSection;
