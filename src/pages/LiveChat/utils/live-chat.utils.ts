import type { TConversation } from "../types/conversation.type";

export type AutoResolveMode = "flow" | "ai_agent";

type LiveChatMeta = {
  mode?: AutoResolveMode | string | null;
  humanIntervened?: boolean;
  escalationReason?: string;
  autoResolveActive?: boolean;
  assigneeId?: string | null;
  assigneeName?: string | null;
  assigneeEmail?: string | null;
  pendingRequest?: {
    userId?: string | null;
    name?: string | null;
    email?: string | null;
    requestedAt?: string | null;
  } | null;
  chatFlowId?: string | null;
  aiAgentId?: string | null;
  flow?: {
    chatFlowId?: string | null;
    status?: string | null;
  };
};

export function liveChatMeta(conversation?: TConversation | null): LiveChatMeta {
  return ((conversation?.metadata as { liveChat?: LiveChatMeta } | undefined)
    ?.liveChat || {}) as LiveChatMeta;
}

export function getAutoResolveMode(
  conversation?: TConversation | null,
): AutoResolveMode | null {
  const liveChat = liveChatMeta(conversation);
  const identifiers = (conversation?.identifiers || {}) as {
    chatFlowId?: string | null;
    aiAgentId?: string | null;
  };

  if (liveChat.mode === "ai_agent") return "ai_agent";
  if (liveChat.mode === "flow") return "flow";

  if (liveChat.aiAgentId || identifiers.aiAgentId) {
    return "ai_agent";
  }

  if (
    liveChat.chatFlowId ||
    liveChat.flow?.chatFlowId ||
    identifiers.chatFlowId
  ) {
    return "flow";
  }

  return null;
}

export function getResolverLabel(mode: AutoResolveMode | null) {
  return mode === "flow" ? "Automation" : "AI";
}

export function isAutoResolvePaused(conversation?: TConversation | null) {
  if (conversation?.platform !== "whatsapp") return false;
  const liveChat = liveChatMeta(conversation);
  if (!getAutoResolveMode(conversation)) return false;
  return Boolean(liveChat.humanIntervened && !liveChat.escalationReason);
}

export function getLiveChatAssignee(conversation?: TConversation | null) {
  const liveChat = liveChatMeta(conversation);
  const assigneeId = String(liveChat.assigneeId || "").trim();
  if (!assigneeId) return null;
  return {
    id: assigneeId,
    name: String(liveChat.assigneeName || "").trim() || "Teammate",
    email: String(liveChat.assigneeEmail || "").trim(),
  };
}

/** Current user may use the composer when nobody owns the chat, or they are the assignee. */
export function canComposeLiveChat(
  conversation: TConversation | null | undefined,
  userId?: string | null,
) {
  if (conversation?.platform !== "whatsapp") return true;
  const assignee = getLiveChatAssignee(conversation);
  if (!assignee) return true;
  return Boolean(userId && assignee.id === String(userId));
}

/** Only the owner (or anyone, when no owner yet) can hand back to automation/AI. */
export function canHandBackLiveChat(
  conversation: TConversation | null | undefined,
  userId?: string | null,
) {
  if (!isAutoResolvePaused(conversation)) return false;
  const assignee = getLiveChatAssignee(conversation);
  if (!assignee) return true;
  return Boolean(userId && assignee.id === String(userId));
}

/** Show Request Intervention when another teammate already owns the chat. */
export function needsInterventionRequest(
  conversation: TConversation | null | undefined,
  userId?: string | null,
) {
  if (conversation?.platform !== "whatsapp") return false;
  const assignee = getLiveChatAssignee(conversation);
  if (!assignee) return false;
  return Boolean(userId && assignee.id !== String(userId));
}

export function getPendingInterventionRequest(
  conversation?: TConversation | null,
) {
  const pending = liveChatMeta(conversation).pendingRequest;
  const userId = String(pending?.userId || "").trim();
  if (!userId) return null;
  return {
    id: userId,
    name: String(pending?.name || "").trim() || "Teammate",
    email: String(pending?.email || "").trim(),
  };
}
