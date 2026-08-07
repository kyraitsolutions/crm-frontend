import { whatsappService } from "@/pages/Channels/whatsapp/services/whatsapp.service";
import { useMessageStore } from "@/pages/LiveChat/store/message.store";

export const useChatSender = () => {
  const { appendMessage } = useMessageStore();

  const sendMessage = async (accountId: string, outgoing: any) => {
    // optimistic update
    const optimisticId = crypto.randomUUID();
    appendMessage(optimisticId, outgoing);

    try {
      const response = await whatsappService.sendMessage(accountId, outgoing);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  return { sendMessage };
};
