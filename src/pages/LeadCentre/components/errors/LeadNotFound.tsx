import { ArrowRightCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";

const LeadNotFound = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="text-center">
        <img
          src="/src/assets/nochathistoryfound_CnSlq9EOHBW59HI8RYjeSpZ_WbWyQz9RmyNcvToLwGw4g31mlf1rnCox3Y3F-6xk_.svg"
          rel="preload"
          fetchPriority="high"
          alt="No chats yet"
          className="w-75 object-cover "
        />
        <h3 className="text-sm font-semibold text-gray-800">No leads yet</h3>

        <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
          Start managing leads,{" "}
          <Link
            to="/dashboard/settings/webhook"
            className="text-blue-600 underline flex items-center gap-1"
          >
            {" "}
            setup webhook <ArrowRightCircleIcon size={14} />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LeadNotFound;
