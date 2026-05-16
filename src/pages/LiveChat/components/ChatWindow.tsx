import { useCallback, useEffect } from "react";
import { useConversationStore } from "../store/conversation.store";
import ChatArea from "./ChatArea";
import ChatHeader from "./ChatHeader";
import ChatMessagebox from "./ChatMessagebox";
import { useMessageStore } from "../store/message.store";
import { useSocketEvent } from "@/websocket/socket.hook";
import { LIVE_CHAT_SOCKET_EVENTS } from "@/constants/socketEvent.constatn";
import { ChatMessagesSkeleton } from "./skeletons/ChatMessageSkelton";
import { buildAndGetVisitorDisplayNameByVisitorId } from "../utils/getVisitorDisplayName";

const ChatWindow = () => {
  const { selectedConversationId, conversations } = useConversationStore(
    (state) => state,
  );
  const { fetchMessages, messages, appendMessage, loadingMessages } =
    useMessageStore((state) => state);

  const fetchMessagesByConversationId = async (conversationId: string) => {
    await fetchMessages(conversationId);
  };

  useEffect(() => {
    if (!selectedConversationId) return;
    fetchMessagesByConversationId(selectedConversationId);
  }, [selectedConversationId]);

  useSocketEvent(
    LIVE_CHAT_SOCKET_EVENTS?.MESSAGES?.NEW_MESSAGE,
    useCallback(
      (data) => {
        appendMessage(String(selectedConversationId), data?.message);
      },
      [selectedConversationId],
    ),
  );

  // if (selectedConversationId) {
  //   return (
  //     <div className="flex h-full flex-col items-center justify-center bg-gray-50 border-l border-r">
  //       <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
  //         <MessageSquareMore className="h-10 w-10 text-primary" />
  //       </div>

  //       <h2 className="mt-6 text-2xl font-semibold text-gray-800">
  //         Select a conversation
  //       </h2>

  //       <p className="mt-2 max-w-sm text-center text-sm text-gray-500">
  //         Choose a conversation from the sidebar to start viewing messages and
  //         replying to customers.
  //       </p>
  //     </div>
  //   );
  // }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-700">No messages yet</h3>

          <p className="mt-1 text-sm text-gray-500">
            Start the conversation by sending a message.
          </p>
        </div>
      </div>
    );
  }

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId,
  );

  return (
    <div className="bg-gray-100">
      <ChatHeader
        name={String(
          buildAndGetVisitorDisplayNameByVisitorId(
            selectedConversation?.visitorId || "",
          ),
        )}
        platform={selectedConversation?.platform || "chatbot"}
      />
      {loadingMessages ? (
        <ChatMessagesSkeleton />
      ) : (
        <ChatArea messages={messages} />
      )}
      <ChatMessagebox />
    </div>
  );
};

export default ChatWindow;
