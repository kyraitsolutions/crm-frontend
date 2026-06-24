import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";
import { Settings } from "@/icons/icons";
import { CheckCheck, LucideSettings2 } from "lucide-react";
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
          <ButtonWithTitle
            title="Open Filters"
            position="bottom"
            className="border p-2 rounded border-gray-400 text-gray-800 cursor-pointer"
          >
            <LucideSettings2 size={16} />
          </ButtonWithTitle>
          {/* <button
            disabled={markAllRead}
            title="Mark as all read"
            onClick={(e) => {
              e.stopPropagation();
              markAllAsRead();
            }}
            className="border p-2 rounded border-gray-400 text-gray-800 font-bold">
            <LucideMailOpen size={16} />
          </button> */}
          <ButtonWithTitle
            title="Settings"
            onClick={() => navigate("/dashboard/settings/notifications")}
            className="border p-2 rounded border-gray-400 text-gray-800 cursor-pointer font-bold"
          >
            <Settings />
          </ButtonWithTitle>

          <ButtonWithTitle
            disabled={markAllRead}
            title="Mark as all read"
            onClick={(e) => {
              e.stopPropagation();
              markAllAsRead();
            }}
            className={`border p-2 rounded border-gray-400 text-gray-800 font-bold cursor-pointer ${markAllRead && "bg-primary text-white"}`}
          >
            <CheckCheck size={16} />
          </ButtonWithTitle>
        </div>
      </div>
    </div>
  );
};

export default NotificationHeader;
