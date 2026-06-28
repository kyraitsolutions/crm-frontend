import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>

        <CardContent>
          <ActivityLogLists />
        </CardContent>
      </Card>
    </main>
  );
};

export default ActivityLogsPage;
