import DashboardChartsSection from "./components/charts/crm/DashboardChartsSection";
import RecentLeads from "./components/recent/RecentLead";
import DashboardSummarySection from "./components/summary/SummarySection";

const CRMAnalyticsPage = () => {
  return (
    <main className="space-y-4">
      <DashboardSummarySection />
      <DashboardChartsSection />
      <RecentLeads />
    </main>
  );
};

export default CRMAnalyticsPage;
