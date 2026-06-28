import Loader from "@/components/Loader";
import { useActivityLogStore } from "../store/activity-logs.store";

import ActivityLogEmpty from "./ActivityLogEmpty";
import { ActivityLogItem } from "./ActivityItem";
// import { ActivityLogItem } from "./ActivityItem";
// import { ActivityItem } from "./ActivityItem";

const ActivityLogLists = () => {
  const { logs, loading } = useActivityLogStore();

  if (loading) {
    return (
      <div className="flex justify-center">
        <Loader size={25} color="gray" />
      </div>
    );
  }

  if (!logs.length) {
    return <ActivityLogEmpty />;
  }

  return (
    <div className="space-y-2">
      {logs.map((log, index) => (
        <ActivityLogItem
          key={log.id}
          log={log}
          isLast={index === logs.length - 1}
        />
      ))}
    </div>
  );
};

export default ActivityLogLists;
