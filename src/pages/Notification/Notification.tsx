import { NOTIFICATION_SOCKET_EVENTS } from "@/constants/socketEvent.constatn";
import { LEADS_PATHS } from "@/constants/routes/leads.path";
import { ACCOUNT_PATHS } from "@/constants/routes";
import { useAuthStore } from "@/stores";
import { useSocketEvent } from "@/websocket/socket.hook";
import { useConversationStore } from "@/pages/LiveChat/store/conversation.store";
import {
  Fragment,
  useCallback,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useNavigate } from "react-router-dom";
import NotificationCard from "./components/NotificationCard";
import NotificationHeader from "./components/NotificationHeader";
import { useNotificationStore } from "./store/notification.store";
import DataLoader from "@/components/Loader/data-loader";

const Notification = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useAuthStore((state) => state);
  const navigate = useNavigate();
  const {
    notifications,
    loadingNotifications,
    fetchNotifications,
    prependNotification,
    markAsRead,
  } = useNotificationStore((state) => state);

  const organizationId = String(
    (user as any)?.organization?.id || (user as any)?.organization?._id || "",
  );

  useEffect(() => {
    if (!organizationId || organizationId === "undefined") return;
    void fetchNotifications(organizationId);
  }, [organizationId, fetchNotifications]);

  useSocketEvent(
    NOTIFICATION_SOCKET_EVENTS?.NOTIFICATION?.NEW_NOTIFICATION,
    useCallback((data) => {
      const notification = data?.notification || data;
      if (!notification) return;
      prependNotification(notification);
      if (typeof window !== "undefined" && "Notification" in window) {
        if (window.Notification.permission === "granted") {
          new window.Notification(notification.title || "New notification", {
            body: notification.description || notification.title,
          });
        }
      }
    }, [prependNotification]),
  );

  const openNotification = (notification: any) => {
    markAsRead(String(notification.id || notification._id));
    const accountId = String(
      notification.accountId || notification.meta?.accountId || "",
    );
    const type = notification.type;
    const leadId = notification.meta?.leadId || notification.typeId;
    const conversationId =
      notification.meta?.conversationId || notification.typeId;

    if (type === "new_lead" && accountId && leadId) {
      setOpen(false);
      navigate(LEADS_PATHS.getLeadDetail(accountId, String(leadId)));
      return;
    }

    if ((type === "message" || type === "communication") && accountId) {
      if (conversationId) {
        useConversationStore
          .getState()
          .setSelectConversationId(String(conversationId));
      }
      setOpen(false);
      navigate(`${ACCOUNT_PATHS.byId(accountId)}/live-chat`);
    }
  };

  return (
    <Fragment>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="absolute h-screen w-screen bg-black/40 top-0 right-0 z-10 flex justify-end"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-linear-to-b from-green-50 to-orange-50 w-100 h-full px-4 overflow-y-scroll hide-scrollbar shadow-xl"
          >
            <NotificationHeader />

            <h1 className="text-md font-semibold mt-2">Latest</h1>

            {loadingNotifications && notifications.length === 0 ? (
              <div className="py-8">
                <DataLoader />
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-slate-500 mt-6">
                No notifications yet. New leads and WhatsApp conversations will
                appear here.
              </p>
            ) : (
              <div className="divide-y divide-primary/10! mt-4">
                {notifications.map((notification) => (
                  <button
                    type="button"
                    key={notification.id}
                    className="w-full text-left"
                    onClick={() => openNotification(notification)}
                  >
                    <NotificationCard data={notification} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Notification;
