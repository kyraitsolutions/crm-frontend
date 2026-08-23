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
  updateMessage: (conversationId: string, message: TMessage) => void;
  clearMessages: (conversationId: string) => void;
  replaceMessageId: (clientMessageId: string, messageId: string) => void;
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

  updateMessage: (conversationId, message) => {
    if (String(message?.conversationId) !== String(conversationId)) return;

    set((state) => ({
      messages: state.messages.map((item) => {
        if (item.messageId === message.messageId) {
          return message;
        }
        return item;
      }),
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

  replaceMessageId: (clientMessageId, messageId) => {
    console.log("replaceMessageId", clientMessageId, messageId);
    set((state) => ({
      messages: state.messages.map((item: any) =>
        String(item.clientMessageId) === String(clientMessageId)
          ? {
              ...item,
              messageId,
            }
          : item,
      ),
    }));
  },
}));
