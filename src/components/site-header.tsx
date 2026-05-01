import { useAuthStore } from "@/stores";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getFirstWordOfSentence } from "@/utils/typography.utils";
import { Bell, Plus, Search, Settings } from "lucide-react";
import { IconQuestionMark } from "@tabler/icons-react";
import { ROUTES } from "@/constants/routes";

export function SiteHeader() {
  const { accountName, user } = useAuthStore((state) => state);
  const organizationName = user?.userprofile?.organizationName;

  const baseUrl = `${ROUTES.DASHBOARD}/settings`;

  console.log(user)

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
              Trial expires in 14 days
            </span>

            {/* Upgrade Button */}
            <button className="bg-primary hover:bg-primary/80 text-white text-sm px-4 py-1.5 rounded font-medium transition">
              Upgrade
            </button>

            {/* Add Button */}

            <button className="p-1.5 flex items-center justify-center bg-primary hover:bg-primary/80 text-white rounded">
              <Plus size={20} />
            </button>
            <button className="p-1.5 flex items-center justify-center  hover:bg-primary/20 hover:text-primary rounded">
              <Search size={20} />
            </button>
            <button className="p-1.5 flex items-center justify-center hover:bg-primary/20 hover:text-primary rounded">
              <Bell size={20} />
            </button>
            <button className="p-1.5 flex items-center justify-center  hover:bg-primary/20 hover:text-primary rounded">
              <IconQuestionMark size={20} />
            </button>
            <Link
              to={baseUrl}
              className="p-1.5 flex items-center justify-center  hover:bg-primary/20 hover:text-primary rounded"
            >
              <Settings size={18} />
            </Link>
            <div className="h-5 w-0.5 bg-gray-300"></div>
          </div>

          <Link to={`${baseUrl}/profile`}>
            <Avatar className="">
              {user?.userprofile?.profilePicture && (
                <AvatarImage className="object-cover" src={user.userprofile.profilePicture} />
              )}
              <AvatarFallback>
                {getFirstWordOfSentence(user?.userprofile?.firstName || "") || "A"}
              </AvatarFallback>
            </Avatar>

          </Link>
        </div>
      </div>
    </header>
  );
}
