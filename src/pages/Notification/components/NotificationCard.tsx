import { Chatbot } from "@/icons/icons";

import { MdOutlinePeopleOutline } from "react-icons/md";
import { TbNotification } from "react-icons/tb";
import { formatDate } from "@/utils/date-utils";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { TNotification } from "../types/notification.type";

const NotificationCard = ({ data }: { data: TNotification }) => {
  return (
    <div
      className={`relative flex gap-4 items-start px-4 py-2.5 transition-all duration-200 cursor-pointer hover:-translate-y-[1px] ${!data?.isRead
          ? "bg-primary/5 border-primary/25 shadow-primary/10"
          : "border-gray-200"
        }`}
    >
      {/* {!data?.isRead && (
        <span className="absolute top-4 right-4 size-2.5 rounded-full bg-primary animate-pulse" />
      )} */}

      <div className="relative shrink-0">
        <Avatar className="size-11 flex items-center justify-center bg-gray-100 border border-gray-200">
          <AvatarImage
            className="object-cover bg-orange-600 text-white"
            src={data?.image || ""}
          />

          <MdOutlinePeopleOutline size={20} className="text-gray-400" />
        </Avatar>

        <span className="absolute bottom-0 -right-1 size-5 flex items-center justify-center rounded-full ring-2 ring-white bg-green-500 shadow-sm">
          <Chatbot />
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-xs font-medium break-words ${!data?.isRead ? "text-primary" : "text-gray-800"
              }`}
          >
            {data.title}
          </p>

          {!data?.isRead && (
            <span className="shrink-0 text-[8px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary/15 text-primary">
              New
            </span>
          )}
        </div>

        <p
          className={`text-xs leading-relaxed ${!data?.isRead ? "text-gray-700" : "text-gray-500"
            }`}
        >
          {data.description}
        </p>

        <div className="flex items-center gap-1 pt-1 text-gray-400">
          <TbNotification size={14} />

          <p className="text-[11px]">{formatDate(data.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;

// <div
//   className={`flex gap-4 items-center px-3 py-1 rounded-2xl ${!data?.isRead && "bg-linear-to-r from-primary/10 to-black/05 border border-gray-300"}`}
// >
//   <div className="relative">
//     <Avatar className="size-10 flex items-center justify-center bg-gray-100">
//       <AvatarImage
//         className="object-cover bg-orange-600 text-white"
//         src={data?.image || ""}
//       />
//       <MdOutlinePeopleOutline size={20} className="text-gray-400" />
//     </Avatar>

//     <span className="absolute bottom-0 -right-1 size-4 flex items-center justify-center rounded-full ring-2 ring-white bg-green-400 z-50">
//       <Chatbot />
//     </span>
//   </div>

//   <div className="w-full flex flex-col gap-1">
//     <p className="text-sm text-primary font-medium">{data.title}</p>
//     <p className="text-xs">{data.description}</p>
//     <p className="flex text-xs items-center gap-1 text-gray-500">
//       <TbNotification size={15} /> {formatDate(data.createdAt)}
//     </p>
//   </div>
// </div>
