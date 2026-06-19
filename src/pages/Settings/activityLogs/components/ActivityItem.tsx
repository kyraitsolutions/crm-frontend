import { formatDistanceToNow } from "date-fns";
import type { ActivityLog } from "../types/activity-log.type";
import {
  getActivityIcon,
  getActivityMessage,
} from "../utils/activity-logs.utils";

export function ActivityLogItem({ log }: { log: ActivityLog }) {
  const Icon = getActivityIcon(log.action);

  return (
    <div className="flex gap-4 ">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border">
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1">
        <p className="font-medium">{getActivityMessage(log)} → {log.entityType}</p>

        <p className="text-muted-foreground text-sm">
          {formatDistanceToNow(new Date(log.createdAt), {
            addSuffix: true,
          })}
        </p>

        {Object.keys(log.changes || {}).length > 0 && (
          <div className="mt-3 rounded-md border bg-muted/30 p-3">
            {Object.entries(log.changes).map(([key, value]: any) => {
              if (key === "_id") return null;

              if (key === "notes") {
                const oldNotes = value.from || [];
                const newNotes = value.to || [];

                const addedNotes = newNotes.filter(
                  (note: any) =>
                    !oldNotes.some((old: any) => old._id === note._id)
                );

                return (
                  <div key={key} className="space-y-2">
                    <div className="font-medium">Notes</div>

                    {addedNotes.map((note: any) => (
                      <div
                        key={note._id}
                        className="rounded border bg-white p-2 text-sm"
                      >
                        <div>
                          <span className="font-medium">Type:</span>{" "}
                          {note.activitySource}
                        </div>

                        <div>
                          <span className="font-medium">Message:</span>{" "}
                          {note.message}
                        </div>

                        <div>
                          <span className="font-medium">Created:</span>{" "}
                          {new Date(note.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <div key={key} className="flex gap-2 text-sm">
                  <span className="font-medium">{key}</span>

                  {value.from && (
                    <>
                      <span>{String(value.from)}</span>
                      <span>→</span>
                    </>
                  )}

                  <span>{String(value.to)}</span>
                </div>
              );
            })}
          </div>
        )}

        <div>
          <p>By {log.actor.type}</p>
          <p>{log.actor.name}</p>
        </div>
      </div>
    </div>
  );
}
