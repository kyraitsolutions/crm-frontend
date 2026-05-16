import { NOTIFICATION_SOCKET_EVENTS } from "@/constants/socketEvent.constatn";
import { useAuthStore } from "@/stores";
import { useSocketEvent } from "@/websocket/socket.hook";
import {
  Fragment,
  useCallback,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import NotificationCard from "./components/NotificationCard";
import NotificationHeader from "./components/NotificationHeader";
import { useNotificationStore } from "./store/notification.store";

const Notification = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useAuthStore((state) => state);
  const {
    notifications,
    // loadingNotifications,
    fetchNotifications,
    prependNotification,
  } = useNotificationStore((state) => state);

  const getNotifications = async () => {
    await fetchNotifications(String(user?.organization.id));
  };

  useEffect(() => {
    getNotifications();
  }, []);

  useSocketEvent(
    NOTIFICATION_SOCKET_EVENTS?.NOTIFICATION?.NEW_NOTIFICATION,
    useCallback((data) => {
      if (data?.notification) {
        prependNotification(data?.notification);
        new window.Notification(data?.notification?.title, {
          body: data?.notification?.title,
        });
      }
    }, []),
  );

  return (
    <Fragment>
      {open && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
          className="absolute h-screen w-screen bg-black/40 top-0 right-0 z-10 flex justify- "
        >
          <div className="bg-linear-to-b   from-green-50 to-orange-50 w-100 h-full px-4 overflow-y-scroll hide-scrollbar">
            <div className="">
              <NotificationHeader />
            </div>

            <div>
              <h1 className="text-md font-semibold mt-2">High priority</h1>
            </div>

            <div className="divide-y divide-primary/10! mt-4">
              {notifications?.map((notification) => {
                // if (!notification.isPriority) return null;
                return (
                  <NotificationCard key={notification.id} data={notification} />
                );
              })}
            </div>

            {/* 
            <div>
              <h1 className="text-md font-semibold mt-2">Others</h1>
            </div> */}

            {/* {notifications?.map((notification) => {
              if (notification.isPriority) return null;
              return (
                <NotificationCard key={notification.id} data={notification} />
              );
            })} */}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Notification;
