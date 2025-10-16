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
}
