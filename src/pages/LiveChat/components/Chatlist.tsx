import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import { Chatbot, Instagram } from "@/icons/icons";
import { useState } from "react";
import { MdChatBubble, MdOutlinePeopleOutline } from "react-icons/md";
import type { TConversation } from "../types/conversation.type";
import { Bot, LucideInstagram, MessageSquareText } from "lucide-react";
import { useConversationStore } from "../store/conversation.store";
import { ChatListSkeleton } from "./skeletons/ChatListSkeleton";
import Loader from "@/components/Loader";
import { formatTime } from "@/utils/date-utils";
import { buildAndGetVisitorDisplayNameByVisitorId } from "../utils/getVisitorDisplayName";

interface ChatListProps {
  conversationList: TConversation[] | [];
}

// const formatTime = (date: string) => {
//   return new Intl.DateTimeFormat("en-US", {
//     hour: "numeric",
//     minute: "numeric",
//     hour12: true,
//   }).format(new Date(date));
// };
const Chatlist = ({ conversationList }: ChatListProps) => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const { isRefetching, isLoadingMore, setSelectConversationId } =
    useConversationStore((state) => state);

  if (isRefetching) {
    return <ChatListSkeleton />;
  }

  if (!conversationList?.length) {
    return (
      <div className="flex h-[calc(100vh-180px)] flex-col items-center justify-center px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <MessageSquareText size={38} className="text-primary" />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-gray-800">
          No Conversations Found
        </h2>

        <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-gray-500">
          There are no conversations available right now. Try changing filters
          or wait for new incoming chats.
        </p>
      </div>
    );
  }

  return (
    <div>
      {conversationList?.length > 0 &&
        conversationList?.map((conv) => {
          const name =
            conv?.profile?.displayName ||
            buildAndGetVisitorDisplayNameByVisitorId(conv?.visitorId);

          const lastMessage = conv?.lastMessage?.text || "No messages yet";

          return (
            <div
              key={conv._id}
              onClick={() => {
                setActiveChat(conv._id);
                setSelectConversationId(conv._id);
              }}
              className={`flex gap-3 ${activeChat === conv._id && "bg-primary/10"} hover:bg-primary/10 cursor-pointer group flex items-center w-full py-4 px-4 border-b border-gray-100 transition-all`}
            >
              {/* {index + 1} */}
              {/* Avatar */}
              <div className="relative">
                <Avatar className="size-11 border border-gray-300 flex items-center justify-center bg-gray-100">
                  {conv?.profile?.avatar ? (
                    <AvatarImage
                      className="object-cover"
                      src={conv.profile.avatar}
                    />
                  ) : (
                    <MdOutlinePeopleOutline
                      size={24}
                      className="text-gray-400"
                    />
                  )}
                </Avatar>

                {/* Platform Badge */}
                <span className="absolute -bottom-1 -right-1 size-5 flex items-center justify-center rounded-full ring-2 ring-white bg-green-500 text-white">
                  {conv.platform === "chatbot" ? (
                    <Bot size={12} />
                  ) : conv.platform === "instagram" ? (
                    <LucideInstagram size={14} />
                  ) : conv.platform === "whatsapp" ? (
                    <MdChatBubble size={14} color="#ffffff" />
                  ) : null}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className={`truncate ${
                      activeChat === conv._id ? "font-semibold" : "font-medium"
                    } text-gray-700`}
                  >
                    {name}
                  </h3>

                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatTime(String(conv?.updatedAt))}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-1">
                  <p className="text-sm text-gray-500 ">
                    {lastMessage?.slice(0, 30)}...
                  </p>

                  {conv.unreadCount > 0 && (
                    <span className="min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-primary/90 text-white text-xs font-medium">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

      {isLoadingMore && (
        <div className="flex justify-center py-2.5">
          <Loader color="#435866" />
        </div>
      )}
    </div>
  );
};

export default Chatlist;

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Chatbot, Instagram } from "@/icons/icons";
// import { getFirstWordOfSentence } from "@/utils/typography.utils";
// import { useState } from "react";
// import { MdChatBubble, MdOutlinePeopleOutline } from "react-icons/md";

// interface ChatListProps {
//   chatList: {
//     id: number;
//     img: string;
//     name: string;
//     lastMessage: string;
//     time: string;
//     type: string;
//   }[];
// }
// const Chatlist = ({ chatList }: ChatListProps) => {
//   const [activeChat, setActiveChat] = useState<number | null>(null);
//   return (
//     <>
//       {chatList.map((chat) => (
//         <div
//           key={chat.id}
//           onClick={() => setActiveChat(chat.id)}
//           className={` ${activeChat === chat.id ? "bg-primary/10" : ""}  hover:bg-primary/10 cursor-pointer group flex items-center w-full! py-4 px-4`}
//         >
//           <div className="relative">
//             <Avatar className="h-12 w-12 flex items-center justify-center bg-gray-100">
//               {chat.img ? (
//                 <AvatarImage
//                   className="object-cover bg-orange-600 text-white"
//                   src={chat.img}
//                 />
//               ) : (
//                 <MdOutlinePeopleOutline size={32} className="text-gray-400" />
//               )}
//               {/* <AvatarFallback className="bg-orange-600 text-white">
//                                 {getFirstWordOfSentence(chat.name || "") || "A"}
//                             </AvatarFallback> */}
//             </Avatar>

//             <span className="absolute -bottom-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full ring-2 ring-white bg-green-400">
//               {chat.type === "chatbot" ? (
//                 <Chatbot />
//               ) : chat.type === "instagram" ? (
//                 <Instagram />
//               ) : chat.type === "whatsapp" ? (
//                 <MdChatBubble size={14} color="#ffffff" />
//               ) : null}
//             </span>
//           </div>

//           <div className="ml-3 w-full">
//             <div className="flex items-center gap-2 justify-between">
//               <h3
//                 className={`${activeChat === chat.id ? "font-semibold" : "font-medium"} group-active:font-semibold md:group-hover:font-semibold duration-75 transition-all ease-linear text-gray-900`}
//               >
//                 {chat.name}
//               </h3>
//               <span className="text-sm font-normal text-gray-400">
//                 {chat.time}
//               </span>
//             </div>

//             <p className="text-sm font-medium text-gray-500">
//               {chat.lastMessage.substring(0, 25)}...
//             </p>
//           </div>
//         </div>
//       ))}
//     </>
//   );
// };

// export default Chatlist;
