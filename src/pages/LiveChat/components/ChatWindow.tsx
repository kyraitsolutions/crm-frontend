import { useCallback, useEffect, useState } from "react";
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
import { ToastMessageService } from "@/services";
import { Button } from "@/components/ui/button";
import {
  canComposeLiveChat,
  canHandBackLiveChat,
  getAutoResolveMode,
  getLiveChatAssignee,
  getPendingInterventionRequest,
  getResolverLabel,
  isAutoResolvePaused,
  needsInterventionRequest,
} from "../utils/live-chat.utils";

const ChatWindow = () => {
  const { accountId, user } = useAuthStore();
  const toast = new ToastMessageService();
  const [resuming, setResuming] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const {
    selectedConversationId,
    conversations,
    selectedMessageId,
    clearLiveChatIntervention,
    markLiveChatIntervention,
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
  const autoResolveMode = getAutoResolveMode(selectedConversation);
  const autoResolvePaused = isAutoResolvePaused(selectedConversation);
  const resolverLabel = getResolverLabel(autoResolveMode);
  const assignee = getLiveChatAssignee(selectedConversation);
  const pendingRequest = getPendingInterventionRequest(selectedConversation);
  const userId = user?.id != null ? String(user.id) : "";
  const canCompose = canComposeLiveChat(selectedConversation, userId || null);
  const canHandBack = canHandBackLiveChat(selectedConversation, userId || null);
  const showRequestIntervention = needsInterventionRequest(
    selectedConversation,
    userId || null,
  );
  const isAssignee = Boolean(assignee && userId && assignee.id === userId);
  const isPendingRequester = Boolean(
    pendingRequest && userId && pendingRequest.id === userId,
  );
  const showAcceptRequest = Boolean(
    isAssignee && pendingRequest && pendingRequest.id !== userId,
  );

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.userProfile?.firstName ||
    user?.email ||
    "You";

  const handleResumeAutoResolve = async () => {
    if (!accountId || !selectedConversation?.id || resuming) return;
    setResuming(true);
    try {
      await whatsappLiveChatService.resumeConversation(
        String(accountId),
        selectedConversation.id,
      );
      clearLiveChatIntervention(selectedConversation.id);
      toast.success(`${resolverLabel} will reply to this chat again`);
    } catch (error: any) {
      toast.error(
        error?.message || `Could not hand this chat back to ${resolverLabel}`,
      );
    } finally {
      setResuming(false);
    }
  };

  const handleRequestIntervention = async () => {
    if (!accountId || !selectedConversation?.id || claiming) return;
    setClaiming(true);
    try {
      const response = await whatsappLiveChatService.claimIntervention(
        String(accountId),
        selectedConversation.id,
      );
      const doc = response?.data?.doc as
        | {
            status?: string;
            assigneeId?: string;
            assigneeName?: string;
            assigneeEmail?: string;
            pendingRequest?: {
              userId?: string;
              name?: string;
              email?: string;
            };
          }
        | undefined;

      if (doc?.status === "request_sent") {
        markLiveChatIntervention(selectedConversation.id, {
          assigneeId: doc.assigneeId || assignee?.id,
          assigneeName: doc.assigneeName || assignee?.name,
          assigneeEmail: doc.assigneeEmail || assignee?.email,
          pendingRequest: {
            userId: doc.pendingRequest?.userId || userId,
            name: doc.pendingRequest?.name || displayName,
            email: doc.pendingRequest?.email || user?.email || "",
          },
        });
        toast.success("Request sent. Waiting for the teammate to accept.");
      } else {
        markLiveChatIntervention(selectedConversation.id, {
          assigneeId: doc?.assigneeId || userId || null,
          assigneeName: doc?.assigneeName || displayName,
          assigneeEmail: doc?.assigneeEmail || user?.email || "",
          pendingRequest: null,
        });
        toast.success("You are now handling this conversation");
      }
    } catch (error: any) {
      toast.error(error?.message || "Could not request intervention");
    } finally {
      setClaiming(false);
    }
  };

  const handleAcceptIntervention = async () => {
    if (!accountId || !selectedConversation?.id || accepting) return;
    setAccepting(true);
    try {
      const response = await whatsappLiveChatService.acceptIntervention(
        String(accountId),
        selectedConversation.id,
      );
      const doc = response?.data?.doc as
        | {
            assigneeId?: string;
            assigneeName?: string;
            assigneeEmail?: string;
          }
        | undefined;
      markLiveChatIntervention(selectedConversation.id, {
        assigneeId: doc?.assigneeId || pendingRequest?.id,
        assigneeName: doc?.assigneeName || pendingRequest?.name,
        assigneeEmail: doc?.assigneeEmail || pendingRequest?.email,
        pendingRequest: null,
      });
      toast.success("Intervention handed over");
    } catch (error: any) {
      toast.error(error?.message || "Could not accept the request");
    } finally {
      setAccepting(false);
    }
  };

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
        autoResolvePaused={canHandBack}
        resolverLabel={resolverLabel}
      />
      {autoResolvePaused && (
        <div className="flex items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
          <p>
            {assignee
              ? isAssignee
                ? `${resolverLabel} is paused because you took over this chat.`
                : `${resolverLabel} is paused. ${assignee.name} is handling this chat.`
              : `${resolverLabel} is paused because a teammate took over this chat.`}
          </p>
          {canHandBack ? (
            <button
              type="button"
              className="cursor-pointer font-medium underline disabled:opacity-60"
              disabled={resuming}
              onClick={() => void handleResumeAutoResolve()}
            >
              {resuming ? "Handing back..." : `Hand back to ${resolverLabel}`}
            </button>
          ) : null}
        </div>
      )}
      {showAcceptRequest && pendingRequest ? (
        <div className="flex items-center justify-between gap-3 border-b border-sky-200 bg-sky-50 px-4 py-2 text-xs text-sky-900">
          <p>
            {pendingRequest.name} requested intervention on this chat.
          </p>
          <button
            type="button"
            className="cursor-pointer font-medium underline disabled:opacity-60"
            disabled={accepting}
            onClick={() => void handleAcceptIntervention()}
          >
            {accepting ? "Accepting..." : "Accept request"}
          </button>
        </div>
      ) : null}
      <div className="flex-1 min-h-0 pb-2">
        {loadingMessages ? (
          <ChatMessagesSkeleton />
        ) : (
          <ChatArea messages={messages} selectedMessageId={selectedMessageId} />
        )}
      </div>

      <div className="shrink-0">
        {showRequestIntervention ? (
          <div className="flex flex-col items-center gap-3 border-t bg-white px-4 py-5 text-center">
            <p className="text-sm text-muted-foreground">
              {isPendingRequester
                ? `Request sent to ${assignee?.name || "the teammate"}. You can chat after they accept.`
                : `${assignee?.name || "A teammate"} is handling this conversation. Request intervention to chat.`}
            </p>
            {!isPendingRequester ? (
              <Button
                type="button"
                className="actions-btn cursor-pointer rounded-xl! px-5!"
                disabled={claiming}
                onClick={() => void handleRequestIntervention()}
              >
                {claiming ? "Requesting..." : "Request Intervention"}
              </Button>
            ) : null}
          </div>
        ) : canCompose ? (
          <ChatMessagebox platform={selectedConversation?.platform} />
        ) : (
          <div className="border-t bg-white px-4 py-5 text-center text-sm text-muted-foreground">
            You cannot reply to this conversation right now.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
