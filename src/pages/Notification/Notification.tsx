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
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useNavigate } from "react-router-dom";
import NotificationCard from "./components/NotificationCard";
import NotificationHeader from "./components/NotificationHeader";
import { useNotificationStore } from "./store/notification.store";
import DataLoader from "@/components/Loader/data-loader";
import { notificationSettingsService } from "./services/notification-settings.service";
import { ToastMessageService } from "@/services";

const toast = new ToastMessageService();

const MODULE_CHIPS = [
  { key: "all", label: "All" },
  { key: "leads", label: "Leads" },
  { key: "conversations", label: "Chats" },
  { key: "email", label: "Email" },
  { key: "campaigns", label: "Campaigns" },
  { key: "system", label: "System" },
] as const;

function inferModule(notification: any): string {
  if (notification.module) return String(notification.module);
  const eventKey = String(notification.eventKey || "");
  if (eventKey.includes(".")) return eventKey.split(".")[0];
  const type = String(notification.type || "");
  if (type === "new_lead") return "leads";
  if (type === "message" || type === "chatbot" || type === "communication") {
    return "conversations";
  }
  if (type === "system_alert") return "system";
  return "all";
}

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

  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const organizationId = String(
    (user as any)?.organization?.id || (user as any)?.organization?._id || "",
  );

  useEffect(() => {
    if (!organizationId || organizationId === "undefined") return;
    void fetchNotifications(organizationId);
  }, [organizationId, fetchNotifications]);

  useSocketEvent(
    NOTIFICATION_SOCKET_EVENTS?.NOTIFICATION?.NEW_NOTIFICATION,
    useCallback(
      (data) => {
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
      },
      [prependNotification],
    ),
  );

  const filtered = useMemo(() => {
    return notifications.filter((notification) => {
      if (unreadOnly && notification.isRead) return false;
      if (moduleFilter === "all") return true;
      return inferModule(notification) === moduleFilter;
    });
  }, [notifications, moduleFilter, unreadOnly]);

  const resolveEntity = (notification: any) => {
    const eventKey = String(notification.eventKey || "");
    const type = String(notification.type || "");
    const entityType =
      notification.entityType ||
      (eventKey.startsWith("lead.") || type === "new_lead"
        ? "lead"
        : eventKey.startsWith("conversation.") ||
            eventKey === "chatbot.handoff" ||
            type === "message" ||
            type === "chatbot" ||
            type === "communication"
          ? "conversation"
          : null);
    const entityId =
      notification.entityId ||
      notification.meta?.conversationId ||
      notification.meta?.leadId ||
      notification.typeId ||
      null;
    return {
      entityType: entityType ? String(entityType) : null,
      entityId: entityId ? String(entityId) : null,
    };
  };

  const muteNotification = async (notification: any) => {
    const { entityType, entityId } = resolveEntity(notification);
    if (!entityType || !entityId) {
      toast.error("This notification can’t be muted");
      return;
    }
    try {
      const until = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await notificationSettingsService.muteEntity({
        entityType,
        entityId,
        until,
        reason: "muted_from_sidebar",
      });
      toast.success("Muted for 24 hours");
    } catch (error: any) {
      toast.error(error?.message || "Failed to mute");
    }
  };

  const openNotification = (notification: any) => {
    markAsRead(String(notification.id || notification._id));
    const deepLink = String(notification.deepLink || "");
    if (deepLink.startsWith("/dashboard")) {
      setOpen(false);
      navigate(deepLink);
      return;
    }

    const accountId = String(
      notification.accountId || notification.meta?.accountId || "",
    );
    const type = notification.type;
    const eventKey = String(notification.eventKey || "");
    const leadId =
      notification.meta?.leadId ||
      notification.entityId ||
      notification.typeId;
    const conversationId =
      notification.meta?.conversationId ||
      (notification.entityType === "conversation"
        ? notification.entityId
        : null) ||
      notification.typeId;

    if (
      (type === "new_lead" || eventKey.startsWith("lead.")) &&
      accountId &&
      leadId
    ) {
      setOpen(false);
      navigate(LEADS_PATHS.getLeadDetail(accountId, String(leadId)));
      return;
    }

    if (
      (type === "message" ||
        type === "communication" ||
        type === "chatbot" ||
        eventKey.startsWith("conversation.") ||
        eventKey === "chatbot.handoff") &&
      accountId
    ) {
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

            <div className="flex flex-wrap gap-1.5 mt-1">
              {MODULE_CHIPS.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => setModuleFilter(chip.key)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    moduleFilter === chip.key
                      ? "bg-primary text-white border-primary"
                      : "bg-white/80 text-gray-600 border-gray-200"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mt-3">
              <h1 className="text-md font-semibold">Latest</h1>
              <button
                type="button"
                onClick={() => setUnreadOnly((v) => !v)}
                className={`text-xs px-2 py-1 rounded border ${
                  unreadOnly
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-600 border-gray-200"
                }`}
              >
                Unread only
              </button>
            </div>

            {loadingNotifications && notifications.length === 0 ? (
              <div className="py-8">
                <DataLoader />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-slate-500 mt-6">
                {notifications.length === 0
                  ? "No notifications yet. New leads and WhatsApp conversations will appear here."
                  : "No notifications match this filter."}
              </p>
            ) : (
              <div className="divide-y divide-primary/10! mt-4">
                {filtered.map((notification) => (
                  <div key={notification.id} className="relative">
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => openNotification(notification)}
                    >
                      <NotificationCard data={notification} />
                    </button>
                    <button
                      type="button"
                      className="absolute top-2 right-3 text-[10px] text-gray-500 hover:text-gray-800 underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        void muteNotification(notification);
                      }}
                    >
                      Mute 24h
                    </button>
                  </div>
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
