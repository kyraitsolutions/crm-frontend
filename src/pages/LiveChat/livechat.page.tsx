import { LIVE_CHAT_SOCKET_EVENTS } from "@/constants/socketEvent.constatn";
import { useAuthStore } from "@/stores";
import { useSocketEvent } from "@/websocket/socket.hook";
import { useCallback, useEffect, useRef, useState } from "react";
import ChatFilter from "./components/ChatFilter";
import Chatlist from "./components/Chatlist";
import ChatProfile from "./components/ChatProfile";
import ChatWindow from "./components/ChatWindow";
import { FullChatSkeleton } from "./components/skeletons/FullChatSkeleton";
import { useConversationStore } from "./store/conversation.store";

const LiveChat = () => {
  const {
    selectedConversationId,
    fetchConversations,
    conversations,
    updateConversationRealtime,
    isInitialLoading,
    hasFetchedOnce,
    loadMoreConversations,
  } = useConversationStore((state) => state);

  const { accountId } = useAuthStore((state) => state);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleScroll = (e: any) => {
    const target = e.currentTarget;

    if (timeoutRef.current) return;

    timeoutRef.current = setTimeout(() => {
      const bottomReached =
        target.scrollHeight - target.scrollTop <= target.clientHeight + 50;

      console.log(bottomReached);

      if (bottomReached) {
        loadMoreConversations();
      }

      timeoutRef.current = null;
    }, 200);
  };

  useEffect(() => {
    if (!accountId) return;
    fetchConversations(accountId || "");
  }, []);

  useSocketEvent(
    LIVE_CHAT_SOCKET_EVENTS?.MESSAGES?.NEW_MESSAGE,
    useCallback((data) => {
      updateConversationRealtime(data);
    }, []),
  );

  if (isInitialLoading && !hasFetchedOnce) {
    return <FullChatSkeleton />;
  }

  console.log("selectedConversationId", selectedConversationId);

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${selectedConversationId ? "lg:grid-cols-[3fr_6fr_3fr]" : "lg:grid-cols-[3fr_9fr]"} h-[calc(100vh-64px)] overflow-hidden`}
    >
      <div className="flex flex-col border-r bg-white min-h-0">
        <ChatFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <div
          className="overflow-y-auto hide-scrollbar flex-1"
          onScroll={(e) => handleScroll(e)}
        >
          <Chatlist
            conversationList={conversations || []}
            activeFilter={activeFilter}
          />
        </div>
      </div>

      <ChatWindow />

      {selectedConversationId && (
        <div className="bg-white p-4 border-l ">
          <ChatProfile />
        </div>
      )}
    </div>
  );
};

export default LiveChat;

// h-[calc(100vh-64px)]!
