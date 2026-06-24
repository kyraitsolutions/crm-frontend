import { useAuthStore } from "@/stores";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getFirstWordOfSentence } from "@/utils/typography.utils";
import { Bell, Plus, Search, Settings } from "lucide-react";
import { IconQuestionMark } from "@tabler/icons-react";
import { ROUTES } from "@/constants/routes";
import { useEffect, useState } from "react";
import Notification from "@/pages/Notification/Notification";
import { useNotificationStore } from "@/pages/Notification/store/notification.store";
import ButtonWithTitle from "./ui/Buttons/ButtonWithTitle";
import GlobalSearch from "./globalSearch/GlobalSearch";
import { SubscriptionPlan } from "@/enums/subscription.enum";

export function SiteHeader() {
  const navigate = useNavigate();

  const { accountName, user } = useAuthStore((state) => state);
  const { bellCount, clearBellCount } = useNotificationStore((state) => state);
  // const organizationName = user?.userprofile?.organizationName;

  const baseUrl = `${ROUTES.DASHBOARD}/settings`;

  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [searchEnable, setSearchEnable] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  // Open popup when search has value
  useEffect(() => {
    setOpenSearch(search.trim().length > 0);
  }, [search]);

  const now = new Date();
  const expiryDate = new Date(user?.subscription?.expiresAt as any);

  const totalDaysLeft = Math.ceil(
    (Number(expiryDate) - Number(now)) / (1000 * 60 * 60 * 24),
  );

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {accountName ? (
          <h2 className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium text-gray-600">Account</span>

            <span className="text-gray-400">/</span>

            <span className="font-semibold text-primary truncate max-w-50">
              {accountName || "—"}
            </span>
          </h2>
        ) : (
          <h2 className="text-sm text-gray-400 italic">
            Select an account to continue
          </h2>
        )}
        {/* <h1 className="text-base text-primary font-medium">
          <span className="font-bold tracking-wider">Account</span> {">"}{" "}
          {accountName || ""}
        </h1> */}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-4">
            {/* Trial Text */}
            <span className="text-md text-primary font-medium">
              {
                SubscriptionPlan[
                  user?.subscription?.planId as keyof typeof SubscriptionPlan
                ]
              }{" "}
              expires in {totalDaysLeft} days
            </span>

            {/* Upgrade Button */}
            <button className="bg-primary hover:bg-primary/80 text-white text-sm px-4 py-1.5 rounded font-medium transition">
              Upgrade
            </button>

            {/* Add Button */}

            <button className="p-1.5 flex items-center justify-center bg-second hover:bg-second/90 text-white rounded">
              <Plus size={20} />
            </button>
            {searchEnable && (
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  searchEnable
                    ? "opacity-100 translate-x-0 w-64"
                    : "opacity-0 translate-x-full w-0"
                }`}
              >
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search anything..."
                  className="bg-gray-100 text-sm rounded-xl w-full py-2 px-3 focus:outline-none focus:ring-offset-2"
                />
              </div>
            )}
            <ButtonWithTitle
              title="Search"
              onClick={() => setSearchEnable(!searchEnable)}
              className="p-1.5 flex items-center justify-center  hover:bg-primary/20 hover:text-primary rounded"
            >
              <Search size={20} />
            </ButtonWithTitle>

            <ButtonWithTitle
              title="Notifications"
              onClick={() => {
                setOpen(!open);
                clearBellCount();
              }}
              className=" relative p-2 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-primary/10 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Bell size={20} className="text-gray-700" />

              {bellCount > 0 && (
                <span className=" absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center rounded-full  bg-red-500  text-white text-[10px] font-semibold shadow-md border-2 border-white">
                  {bellCount > 99 ? "99+" : bellCount}
                </span>
              )}
            </ButtonWithTitle>

            <ButtonWithTitle
              title="Help & Support"
              className="p-1.5 flex items-center justify-center  hover:bg-primary/20 hover:text-primary rounded"
            >
              <IconQuestionMark size={20} />
            </ButtonWithTitle>

            <ButtonWithTitle
              title="Settings"
              onClick={() => navigate(baseUrl)}
              className="p-1.5 flex items-center justify-center  hover:bg-primary/20 hover:text-primary rounded"
            >
              <Settings size={18} />
            </ButtonWithTitle>
            <div className="h-5 w-0.5 bg-gray-300"></div>
          </div>

          <Link to={`${baseUrl}/profile`}>
            <Avatar className="">
              {user?.userprofile?.profilePicture && (
                <AvatarImage
                  className="object-cover"
                  src={user.userprofile.profilePicture}
                />
              )}
              <AvatarFallback>
                {getFirstWordOfSentence(user?.userprofile?.firstName || "") ||
                  "A"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>

      <Notification open={open} setOpen={setOpen} />
      <GlobalSearch
        search={search}
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
      />
      {/* <Notification open={open} setOpen={setOpen} /> */}
    </header>
  );
}
