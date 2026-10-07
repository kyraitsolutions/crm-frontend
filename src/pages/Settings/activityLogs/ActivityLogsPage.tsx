import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores";
import { Pagination } from "@/components/pagination";
import { useActivityLogStore } from "./store/activity-logs.store";
import ActivityLogLists from "./components/ActivityLogLists";
import {
  ActivityLogHeader,
  toActivityQueryDates,
  type ActivityLogFilters,
} from "./components/ActivityLogHeader";

const emptyFilters = (): ActivityLogFilters => ({
  search: "",
  entityType: "",
  action: "",
  dateRange: undefined,
});

const ActivityLogsPage = () => {
  const { getLogs, pagination } = useActivityLogStore();
  const { accountId } = useAuthStore((state) => state);
  const [filters, setFilters] = useState<ActivityLogFilters>(emptyFilters);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!accountId) return;
    const dates = toActivityQueryDates(filters.dateRange);
    void getLogs(String(accountId), {
      page,
      limit: 20,
      search: filters.search,
      entityType: filters.entityType,
      action: filters.action,
      startDate: dates.startDate,
      endDate: dates.endDate,
    });
  }, [accountId, filters, page]);

  return (
    <main className="mx-auto flex w-full flex-col gap-5 px-6 py-8">
      <ActivityLogHeader
        filters={filters}
        totalDocs={pagination?.totalDocs || 0}
        onChange={(next) => {
          setPage(1);
          setFilters(next);
        }}
      />
      <ActivityLogLists />
      <Pagination
        currentPage={pagination?.page || page}
        totalPages={pagination?.totalPages || 1}
        goToPage={setPage}
      />
    </main>
  );
};

export default ActivityLogsPage;
