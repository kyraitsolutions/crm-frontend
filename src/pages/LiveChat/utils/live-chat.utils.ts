import type { TConversation } from "../types/conversation.type";

export type AutoResolveMode = "flow" | "ai_agent";

type LiveChatMeta = {
  mode?: AutoResolveMode | string | null;
  humanIntervened?: boolean;
  escalationReason?: string;
  autoResolveActive?: boolean;
  chatFlowId?: string | null;
  aiAgentId?: string | null;
  flow?: {
    chatFlowId?: string | null;
    status?: string | null;
  };
};

function liveChatMeta(conversation?: TConversation | null): LiveChatMeta {
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
