import { useLayoutEffect, useRef } from "react";
import type { TMessage } from "../types/message.type";
import Message from "./Messages/Message";
import { isSameDay } from "date-fns";
import DateSeparator from "./DateSeprator";
import { formatChatDate } from "../utils/date.utils";

type ChatAreaProps = {
  messages: TMessage[] | [];
  selectedMessageId?: string | null;
};

const ChatArea = ({ messages, selectedMessageId }: ChatAreaProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  useLayoutEffect(() => {
    if (!selectedMessageId) return;

    const element = document.getElementById(`message-${selectedMessageId}`);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedMessageId]);

  return (
    <div
      ref={containerRef}
      className="h-[70vh] overflow-y-auto p-4 hide-scrollbar border-l border-r"
    >
      <div className="flex flex-col gap-3">
        {messages?.map((message, index) => {
          const previousMessage = messages[index - 1];

          const showDateSeparator =
            !previousMessage ||
            !isSameDay(previousMessage.createdAt, message.createdAt);

          return (
            <div key={message.messageId} id={`message-${message.messageId}`}>
              {showDateSeparator && (
                <DateSeparator date={formatChatDate(message.createdAt)} />
              )}

              <Message message={message} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatArea;

// import { useLayoutEffect, useRef } from "react";
// import type { TMessage } from "../types/message.type";
// import Message from "./Messages/Message";

// type ChatAreaProps = {
//   messages: TMessage[] | [];
// };

// const ChatArea = ({ messages }: ChatAreaProps) => {
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   // Auto scroll to bottom
//   useLayoutEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
//     container.scrollTop = container.scrollHeight;
//   }, [messages]);

//   return (
//     <div
//       ref={containerRef}
//       className="h-[70vh] overflow-y-auto p-4 hide-scrollbar border-l border-r"
//     >
//       <div className="flex flex-col gap-8">
//         {messages?.length > 0 &&
//           messages.map((message) => (
//             <Message message={message} key={message?.messageId} />
//             // <div
//             //   key={message.messageId}
//             //   className={`flex ${
//             //     message?.from === "user" ? "items-start " : ""
//             //   } gap-3 ${message.sender === "customer" ? "" : "justify-end"}`}
//             // >
//             //   <Avatar
//             //     className={`${message.sender === "customer" ? "" : "order-2"} h-10 w-10 flex items-center justify-center bg-gray-100`}
//             //   >
//             //     <AvatarImage
//             //       className="object-cover bg-orange-600 text-white"
//             //       src={"https://ai-avatar-generator.com/avatars3/nature.png"}
//             //     />
//             //     <AvatarFallback className="bg-orange-600 text-white">
//             //       {getFirstWordOfSentence("Ahadgf") || "A"}
//             //     </AvatarFallback>
//             //   </Avatar>
//             //   <div>
//             //     <div
//             //       className={`px-3 py-2 text-sm max-w-xs rounded-2xl! ${
//             //         message.from === "user"
//             //           ? "bg-white text-gray-700 border border-gray-300 shadow-sm rounded-tl-none!"
//             //           : "bg-primary text-white shadow-sm rounded-tr-none!"
//             //       }`}
//             //     >
//             //       <p>{message?.type === "text" && message.body?.text}</p>
//             //     </div>
//             //     <span
//             //       className={`flex text-xs ${
//             //         message.from === "user"
//             //           ? "text-gray-500"
//             //           : "text-gray-500 justify-end"
//             //       } mt-1`}
//             //     >
//             //       {/* {message.} */}
//             //     </span>
//             //   </div>
//             // </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default ChatArea;
