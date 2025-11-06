import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/stores";
import { formatDate } from "@/utils/date-utils";

const DashboardAccount = () => {
  const authUser = useAuthStore((state) => state.user);

  return (
    <div className="p-5">
      <Card
        key={authUser?.account?.id}
        className="cursor-pointer transform transition-all duration-300 hover:scale-105 rounded-md p-5 bg-white shadow-lg border border-slate-300 w-full max-w-sm"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Left: Avatar + Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Avatar with initials */}
            <div className="w-12 h-12 rounded-full bg-blue-300 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {authUser?.account?.accountName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>

            {/* Account Info */}
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {authUser?.account?.accountName}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {authUser?.account?.email}
              </p>
            </div>
          </div>

          {/* Optional Delete Button */}
          {/* Uncomment if needed */}
          {/* 
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleDeleteAccount(authUser?.account?.id || "");
      }}
      className="text-red-600 hover:text-red-800 p-2 rounded-md flex-shrink-0"
    >
      <Trash2 size={20} />
    </button> 
    */}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-gray-500 text-sm font-medium mt-2">
          <span>Created: {formatDate(authUser?.account?.createdAt || "")}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              authUser?.account?.status === "active"
                ? "bg-green-100 text-green-800"
                : authUser?.account?.status === "inactive"
                ? "bg-gray-100 text-gray-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {authUser?.account?.status}
          </span>
        </div>
      </Card>
    </div>
  );
};

export default DashboardAccount;
