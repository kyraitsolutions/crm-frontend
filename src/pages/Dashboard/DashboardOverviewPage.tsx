import { useAuthStore } from "@/stores";
import { useEffect } from "react";
import { DashboardHeader } from "./components/DashboardHeader";
import ActivitySection from "./components/liveactivity/ActivitySection";
import RecentSection from "./components/recent/RecentSection";
import SnapshotSection from "./components/snapshots/SnapshotSection";
import DashboardSummarySection from "./components/summary/SummarySection";
import CRMAnalyticsPage from "./CRMAnalyticsPage";
import { useDashboardStore } from "./store/dashboard.store";
import DashboardAnalyticsSkeleton from "./skeltons/DashboardAnalyticsSkelton";

const DashboardOverviewPage = () => {
  const { accountId } = useAuthStore((state) => state);
  const { fetchDashboardOverview, filters, loading } = useDashboardStore(
    (state) => state,
  );

  useEffect(() => {
    if (!accountId) return;
    fetchDashboardOverview(String(accountId));
  }, [accountId, filters]);

  const renderModuleView = () => {
    switch (filters?.module) {
      case "leads":
        return <CRMAnalyticsPage />;

      case "overview":
      default:
        return (
          <>
            <DashboardSummarySection />
            <ActivitySection />
            <SnapshotSection />
            <RecentSection />
          </>
        );
    }
  };

  return (
    <div className="bg-gray-100">
      <DashboardHeader />

      {loading ? (
        <div className="p-3">
          <DashboardAnalyticsSkeleton />
        </div>
      ) : (
        <div className="p-3 space-y-4">{renderModuleView()}</div>
      )}
    </div>
  );
};

export default DashboardOverviewPage;
