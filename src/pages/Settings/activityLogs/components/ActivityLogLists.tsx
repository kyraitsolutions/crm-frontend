import { useActivityLogStore } from "../store/activity-logs.store";
import { ActivityLogItem } from "./ActivityItem";
import ActivityLogEmpty from "./ActivityLogEmpty";
import DataLoader from "@/components/Loader/data-loader";

const ActivityLogLists = () => {
  const { logs, loading } = useActivityLogStore();

  if (loading) {
    return <DataLoader className="h-[calc(100vh-200px)]" />;
  }

  if (!logs.length) {
    return <ActivityLogEmpty />;
  }

  return (
    <div className="space-y-6">
      {" "}
      {logs.map((log) => (
        <ActivityLogItem key={log._id} log={log} />
      ))}
    </div>
  );
};

export default ActivityLogLists;
