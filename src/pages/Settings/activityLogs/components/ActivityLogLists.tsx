import Loader from "@/components/Loader";
import { useActivityLogStore } from "../store/activity-logs.store";
import { ActivityLogItem } from "./ActivityItem";
import ActivityLogEmpty from "./ActivityLogEmpty";

const ActivityLogLists = () => {
  const { logs, loading } = useActivityLogStore();

  if (loading) {
    return <Loader />;
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
