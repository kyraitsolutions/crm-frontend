// store/message.store.ts
import { create } from "zustand";
import type { TMessage } from "../types/message.type";
import { messageService } from "../services/message.service";
import {
  createCacheKey,
  getCache,
  isCacheValid,
  setCache,
  type TCacheMap,
} from "../utils/cache.utils";

export const MESSAGE_CACHE_DURATION = 1000 * 10;

type TMessageCache = TCacheMap<TMessage[]>;

type TMessageState = {
  messages: TMessage[] | [];
  loadingMessages: boolean;
  fetchMessages: (conversationId: string) => Promise<void>;
  appendMessage: (conversationId: string, message: TMessage) => void;
  clearMessages: (conversationId: string) => void;
  messageCache?: TMessageCache;
};

export const useMessageStore = create<TMessageState>((set, get) => ({
  messages: [],
  loadingMessages: false,
  fetchMessages: async (conversationId: string) => {
    try {
      const { messageCache } = get();
      const cacheKey = createCacheKey(conversationId);
      const cachedMessages = getCache(messageCache || {}, cacheKey);

      console.log("cachedMessages", cachedMessages);

      // -----------------------------------
      // USE CACHE FIRST
      // -----------------------------------

      if (
        cachedMessages &&
        isCacheValid(cachedMessages.fetchedAt, MESSAGE_CACHE_DURATION)
      ) {
        set({
          messages: cachedMessages.data,
          loadingMessages: false,
        });

        return;
      }

      set({
        loadingMessages: true,
      });

      const params = { conversationId };
      const response = await messageService.getMessages(params);
      const messages = response?.data?.doc || [];

      set((state) => ({
        messages: messages,
        messageCache: setCache({
          cache: state.messageCache || {},
          key: cacheKey,
          data: messages,
        }),
      }));
    } catch (error) {
      console.error("Fetch messages error", error);
    } finally {
      set({
        loadingMessages: false,
      });
    }
  },

  appendMessage: (conversationId, message) => {
    if (message?.conversationId !== conversationId) return;
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  clearMessages: (conversationId) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [],
      },
    }));
  },
}));
