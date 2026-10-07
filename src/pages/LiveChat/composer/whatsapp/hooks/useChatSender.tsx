import { whatsappService } from "@/pages/Channels/whatsapp/services/whatsapp.service";
import { useConversationStore } from "@/pages/LiveChat/store/conversation.store";
import { useMessageStore } from "@/pages/LiveChat/store/message.store";
import { useAuthStore } from "@/stores";
import { buildOptimisticMessage } from "../utils/buildOptimisticMessage";
import type { TOutgoingMessage } from "../utils/buildOutgoingMessage";

type SendMessageProps = {
  accountId: string;
  formData: FormData;
  conversationId?: string;
  outgoing?: TOutgoingMessage;
};

export const useChatSender = () => {
  const { appendMessage, replaceMessageId } = useMessageStore();
  const markLiveChatIntervention = useConversationStore(
    (state) => state.markLiveChatIntervention,
  );
  const user = useAuthStore((state) => state.user);

  const sendMessage = async ({
    accountId,
    formData,
    outgoing,
    conversationId,
  }: SendMessageProps) => {
    const clientMessageId = crypto.randomUUID();

    const optimisticMessage = buildOptimisticMessage({
      accountId: String(accountId),
      conversationId: String(conversationId),
      clientMessageId,
      outgoing: outgoing as TOutgoingMessage,
    });

    appendMessage(String(conversationId), optimisticMessage as any);

    try {
      const response = await whatsappService.sendMessage(accountId, formData);
      const realMessageId = response?.data?.doc?.messages?.[0]?.id;
      if (realMessageId) {
        replaceMessageId(clientMessageId, String(realMessageId));
      }
      if (conversationId && user?.id) {
        const assigneeName =
          [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
          user.userProfile?.firstName ||
          user.email ||
          "You";
        markLiveChatIntervention(conversationId, {
          assigneeId: String(user.id),
          assigneeName,
          assigneeEmail: user.email || "",
        });
      } else if (conversationId) {
        markLiveChatIntervention(conversationId);
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  return { sendMessage };
};
