import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import type { ChatbotListItem } from "@/types";
// import type { ChatBotListItem } from "@/types";

interface IChatBotStoreState {
  chatBotsList: ChatbotListItem[];
}

export const useChatBotStore = create<IChatBotStoreState>()(
  immer((_) => ({
    chatBotsList: [],
  })),
);

export class ChatBotManager {
  private store: typeof useChatBotStore;

  constructor() {
    this.store = useChatBotStore;
  }

  setChatBotsList(chatBotsList: ChatbotListItem[]) {
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

  updateChatBot(chatbotId: string, updatedData: any) {
    this.store.setState((state) => {
      state.chatBotsList = state.chatBotsList.map((chatbot) => {
        if (chatbot.id === chatbotId) {
          return { ...chatbot, ...updatedData };
        }
        return chatbot;
      });
    });
  }

  deleteChatBot(chatbotId: string) {
    this.store.setState((state) => {
      state.chatBotsList = state.chatBotsList.filter(
        (chatbot) => chatbot.id !== chatbotId,
      );
    });
  }
}
