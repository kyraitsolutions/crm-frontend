import { LIVE_CHAT_SOCKET_EVENTS } from "@/constants/socketEvent.constatn";
import { useAuthStore } from "@/stores";
import { useSocketEvent } from "@/websocket/socket.hook";
import { useCallback, useEffect, useRef } from "react";
import ChatFilter from "./components/ChatFilter";
import Chatlist from "./components/Chatlist";
import ChatProfile from "./components/ChatProfile";
import ChatWindow from "./components/ChatWindow";
import { FullChatSkeleton } from "./components/skeletons/FullChatSkeleton";
import { useConversationStore } from "./store/conversation.store";

const LiveChat = () => {
  const {
    fetchConversations,
    conversations,
    updateConversationRealtime,
    isInitialLoading,
    hasFetchedOnce,
    loadMoreConversations,
  } = useConversationStore((state) => state);
  const { accountId } = useAuthStore((state) => state);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = (e: any) => {
    const target = e.currentTarget;

    if (timeoutRef.current) return;

    console.log("Scrolling");

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[3fr_6fr_4fr]  ">
      <div className="bg-white  w-full overflow-hidden h-full ">
        <ChatFilter />

        <div
          className="h-[50vh] border overflow-y-auto hide-scrollbar"
          onScroll={(e) => handleScroll(e)}
        >
          <Chatlist conversationList={conversations || []} />
        </div>
      </div>

      <div>
        <ChatWindow />
      </div>

      <div className="bg-white p-4 ">
        <ChatProfile />
      </div>
    </div>
  );
};

export default LiveChat;
