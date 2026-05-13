import { Settings } from "@/icons/icons";
import { CheckCheck, LucideMailOpen, LucideSettings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../store/notification.store";

const NotificationHeader = () => {
  const { markAllAsRead, markAllRead } = useNotificationStore((state) => state);
  const navigate = useNavigate();
  return (
    <div className="">
      <div className="py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Notifications</h1>
        <div className="flex gap-2 items-center">
          <button className="border p-2 rounded border-gray-400 text-gray-800 font-bold">
            <LucideSettings2 size={16} />
          </button>
          <button className="border p-2 rounded border-gray-400 text-gray-800 font-bold">
            <LucideMailOpen size={16} />
          </button>
          <button
            onClick={() => navigate("/dashboard/settings/notifications")}
            className="border p-2 rounded border-gray-400 text-gray-800 font-bold"
          >
            <Settings />
          </button>

          <button
            disabled={markAllRead}
            title="Mark as all read"
            onClick={(e) => {
              e.stopPropagation();
              markAllAsRead();
            }}
            className={`border p-2 rounded border-gray-400 text-gray-800 font-bold cursor-pointer ${markAllRead && "bg-slate-800 text-white"}`}
          >
            <CheckCheck size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationHeader;
