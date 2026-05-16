// providers/NotificationProvider.tsx

import { createContext, useEffect, useRef, useState } from "react";
import { Bell, BellRing, X } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

export const NotificationContext = createContext({});

const NotificationProvider = ({ children }: Props) => {
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!("Notification" in window)) return;

    const permission = Notification.permission;

    const alreadyAsked = localStorage.getItem("notification_prompt_seen");

    if (permission === "default" && !alreadyAsked) {
      timeoutRef.current = setTimeout(() => {
        setShowBanner(true);
      }, 200);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const requestPermission = async () => {
    try {
      setLoading(true);

      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        localStorage.setItem("notification_permission", "granted");

        console.log("Notifications enabled ✅");

        // Example test notification
        new Notification("Notifications Enabled 🎉", {
          body: "You will now receive updates and alerts.",
          icon: "/favicon.ico",
        });

        setShowBanner(false);
      }

      if (permission === "denied") {
        localStorage.setItem("notification_permission", "denied");
        console.log("Notifications denied ❌");
        setShowBanner(false);
      }

      if (permission === "default") {
        console.log("User dismissed permission popup");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    localStorage.setItem("notification_prompt_seen", "true");
    setShowBanner(false);
  };

  return (
    <>
      {children}

      <div
        className={`fixed top-0 left-0 w-full h-screen  transform transition-all duration-500 ease-out bg-black/40 backdrop-blur-[2px] flex justify-center items-start ${
          showBanner
            ? "translate-y-0 opacity-100"
            : "-translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden max-w-xl w-full rounded-2xl border border-gray-200 bg-white shadow-2xl backdrop-blur-xl">
          {/* Top Accent */}
          <div className="h-1 w-full bg-primary" />

          <div className="relative p-5">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-1 bg-red-200  text-red-400 transition hover:bg-red-300 hover:text-red-500  cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <BellRing size={24} className="text-primary" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900">
                  Enable Notifications
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  Get instant alerts for new messages, updates, activities, and
                  important events in real time.
                </p>

                {/* Actions */}
                <div className="mt-5 flex items-center gap-3">
                  <button
                    onClick={requestPermission}
                    disabled={loading}
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-white transition-all hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Bell size={16} className="mr-2" />
                        Enable
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleClose}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 cursor-pointer"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationProvider;
