import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores";
import { activityLogService } from "@/pages/Settings/activityLogs/service/activity-log.service";
import type { ActivityLog } from "@/pages/Settings/activityLogs/types/activity-log.type";
import { getActionConfig, parseAction } from "@/pages/Settings/activityLogs/utils/action.utils";
import { getEntityConfig } from "@/pages/Settings/activityLogs/utils/entity.utils";
import { getEntityName } from "@/pages/Settings/activityLogs/utils/activity-logs.utils";

const activityVerb = (action: string) => {
  if (action.includes(".")) {
    return parseAction(action).verb;
  }
  const normalized = action.toLowerCase();
  if (normalized.includes("created")) return "created";
  if (normalized.includes("updated")) return "updated";
  if (normalized.includes("deleted")) return "deleted";
  return action;
};

const activityTitle = (log: ActivityLog) => {
  const action = getActionConfig(activityVerb(log.action));
  const entity = getEntityConfig(log.entityType);
  const name = getEntityName(log);
  if (name && name !== log.entityType) {
    return `${action.label} ${entity.label.toLowerCase()}: ${name}`;
  }
  return `${action.label} ${entity.label.toLowerCase()}`;
};

const ActivityCard = () => {
  const { accountId } = useAuthStore((state) => state);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    if (!accountId) return;
    void activityLogService
      .getLogs(String(accountId), { limit: 8, page: 1 })
      .then((response) => {
        setLogs(response.data?.docs || []);
      })
      .catch(() => {
        setLogs([]);
      });
  }, [accountId]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Live Activity</h2>
      </div>

      <div className="space-y-4">
        {logs.length === 0 && (
          <p className="text-sm text-gray-500">No recent activity</p>
        )}
        {logs.map((log) => {
          const entity = getEntityConfig(log.entityType);
          const Icon = entity.icon;
          return (
            <div
              key={log.id}
              className="flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${entity.badge.bg}`}
                >
                  <Icon size={15} className={entity.badge.text} />
                </div>

                <p className="text-sm text-gray-700 leading-5">
                  {activityTitle(log)}
                </p>
              </div>

              <span className="text-xs text-gray-400 whitespace-nowrap">
                {log.createdAt
                  ? formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })
                  : ""}
              </span>
            </div>
          );
        })}
      </div>

      <Link
        to="/dashboard/settings/activity-logs"
        className="mt-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        View All Activities
      </Link>
    </div>
  );
};

export default ActivityCard;
