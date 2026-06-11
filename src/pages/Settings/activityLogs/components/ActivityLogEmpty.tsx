import { Activity } from "lucide-react";

const ActivityLogEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4">
      <div className="bg-muted flex h-14 w-14 items-center justify-center rounded-full">
        <Activity className="text-muted-foreground h-7 w-7" />
      </div>

      <h3 className="mt-4 text-lg font-semibold">No activity found</h3>

      <p className="text-muted-foreground mt-2 max-w-md text-center text-sm">
        Activity logs will appear here when users, automations, or system
        actions create, update, assign, or delete records.
      </p>
    </div>
  );
};

export default ActivityLogEmpty;
