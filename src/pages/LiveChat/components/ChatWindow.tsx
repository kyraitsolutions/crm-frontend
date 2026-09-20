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
import { useAuthStore } from "@/stores";
import { whatsappLiveChatService } from "@/pages/Channels/whatsapp/services/whatsapp-live-chat.service";

const ChatWindow = () => {
  const { accountId } = useAuthStore();
  const {
    selectedConversationId,
    conversations,
    selectedMessageId,
    clearLiveChatIntervention,
  } = useConversationStore((state) => state);
  const {
    fetchMessages,
    messages,
    appendMessage,
    updateMessage,
    loadingMessages,
  } = useMessageStore((state) => state);

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

  useSocketEvent(
    LIVE_CHAT_SOCKET_EVENTS?.MESSAGES?.UPDATE_MESSAGE,
    useCallback(
      (data) => {
        updateMessage(String(selectedConversationId), data?.message);
      },
      [selectedConversationId],
    ),
  );

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId,
  );
  const liveChat = (selectedConversation?.metadata as any)?.liveChat || {};
  const autoResolveMode = liveChat.mode as "flow" | "ai_agent" | undefined;
  const autoResolvePaused = Boolean(
    selectedConversation?.platform === "whatsapp" &&
      (liveChat.humanIntervened || liveChat.escalationReason),
  );
  const resolverLabel = autoResolveMode === "flow" ? "Chatflow" : "AI";

  useEffect(() => {
    const previousId = selectedConversationId;
    const previousPlatform = selectedConversation?.platform;
    return () => {
      if (!accountId || !previousId || previousPlatform !== "whatsapp") return;
      void whatsappLiveChatService
        .resumeConversation(String(accountId), previousId)
        .then((response) => {
          if (response.data?.doc?.resumed) {
            clearLiveChatIntervention(previousId);
          }
        })
        .catch(() => null);
    };
  }, [selectedConversationId]);

  if (!selectedConversation) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <img
            src="/converted_image_transparent.png"
            rel="preload"
            fetchPriority="high"
            alt="No chats yet"
            className="w-75"
          />
          <h3 className="text-sm mt-2 font-semibold text-gray-800">
            No messages yet
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Start the conversation by sending a message.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-gray-50">
      <ChatHeader
        conversationId={selectedConversation.id}
        name={String(
          buildAndGetVisitorDisplayNameByVisitorId(
            selectedConversation?.visitorId || "",
          ) ||
            selectedConversation?.contact?.name ||
            selectedConversation?.contact?.phoneNumber,
        )}
        platform={selectedConversation?.platform || "chatbot"}
        autoResolvePaused={autoResolvePaused}
        resolverLabel={resolverLabel}
      />
      {autoResolvePaused && (
        <div className="flex items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
          <p>
            {resolverLabel} is paused because a teammate took over this chat.
          </p>
          <button
            type="button"
            className="font-medium underline"
            onClick={() =>
              void whatsappLiveChatService
                .resumeConversation(String(accountId), selectedConversation.id)
                .then(() => clearLiveChatIntervention(selectedConversation.id))
                .catch(() => null)
            }
          >
            Hand back to {resolverLabel}
          </button>
        </div>
      )}
      <div className="flex-1 min-h-0 pb-2">
        {loadingMessages ? (
          <ChatMessagesSkeleton />
        ) : (
          <ChatArea messages={messages} selectedMessageId={selectedMessageId} />
        )}
      </div>

      <div className="shrink-0">
        <ChatMessagebox platform={selectedConversation?.platform} />
      </div>
    </div>
  );
};

export default ChatWindow;
