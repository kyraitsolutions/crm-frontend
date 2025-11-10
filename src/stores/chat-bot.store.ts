import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import type { ChatBotListItem } from "@/types";

interface IChatBotStoreState {
  chatBotsList: ChatBotListItem[];
}

export const useChatBotStore = create<IChatBotStoreState>()(
  immer((_) => ({
    chatBotsList: [],
  }))
);

export class ChatBotManager {
  private store: typeof useChatBotStore;

  constructor() {
    this.store = useChatBotStore;
  }

  setChatBotsList(chatBotsList: ChatBotListItem[]) {
    this.store.setState({ chatBotsList });
  }
  updateChatBotStatus(chatbotId: string, newStatus: boolean) {
    this.store.setState((state) => {
      state.chatBotsList = state.chatBotsList.map((chatbot) => {
        if (chatbot.id === chatbotId) {
          return { ...chatbot, status: newStatus };
        }
        return chatbot;
      });
    });
  }

  deleteChatBot(chatbotId: string) {
    this.store.setState((state) => {
      state.chatBotsList = state.chatBotsList.filter(
        (chatbot) => chatbot.id !== chatbotId
      );
    });
  }
}
