import { useAuthStore } from "@/stores";
import { useEffect } from "react";
import { useActivityLogStore } from "./store/activity-logs.store";
import ActivityLogLists from "./components/ActivityLogLists";

const ActivityLogsPage = () => {
  const { getLogs } = useActivityLogStore();
  const { accountId } = useAuthStore((state) => state);

  useEffect(() => {
    getLogs(String(accountId));
  }, [accountId]);

  return (
    <main className="p-4">
      {/* <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader> */}
      <div className="flex flex-col gap-4">
        <h1>Activity Timeline</h1>

        <ActivityLogLists />
      </div>
    </main>
  );
};

export default ActivityLogsPage;
