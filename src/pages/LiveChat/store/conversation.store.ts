"use client";

import { create } from "zustand";
import { conversationService } from "../services/conversation.service";
import type { TConversation } from "../types/conversation.type";
import type { TMessage } from "../types/message.type";
import {
  createCacheKey,
  getCache,
  isCacheValid,
  setCache,
  type TCacheMap,
} from "../utils/cache.utils";

type TConversationQuery = {
  // page: number;
  limit: number;
  search: string;
  platform: "all" | "whatsapp" | "instagram" | "chatbot";
  status: string[];
  tags: string[];
};

type TConversationCacheItem = {
  conversations: TConversation[];
  currentPage: number;
  hasMore: boolean;
};

type TConversationCache = TCacheMap<TConversationCacheItem>;

type TConversationStore = {
  conversations: TConversation[];
  selectedConversationId: string | null;
  loadingConversations: boolean;
  conversationQuery: TConversationQuery;
  currentAccountId: string | null;
  conversationCache: TConversationCache;

  isInitialLoading: boolean;
  isRefetching: boolean;
  hasFetchedOnce: boolean;
  isLoadingMore: boolean;

  fetchConversations: (accountId: string) => Promise<void>;
  setSelectConversationId: (conversationId: string) => void;
  getSelectedConversation: () => TConversation | undefined;
  updateConversationRealtime: ({
    message,
    conversation,
  }: {
    message: TMessage;
    conversation: TConversation;
  }) => void;
  updateConversationQuery: (
    query: Partial<TConversationQuery>,
  ) => Promise<void>;

  resetConversationQuery: () => Promise<void>;
  loadMoreConversations: () => Promise<void>;
};

const initialConversationQuery: TConversationQuery = {
  // page: 1,
  limit: 50,
  search: "",
  platform: "all",
  status: [],
  tags: [],
};

export const useConversationStore = create<TConversationStore>((set, get) => ({
  conversations: [],
  currentAccountId: null,
  selectedConversationId: null,
  loadingConversations: false,
  conversationQuery: {
    limit: 5,
    search: "",
    platform: "all",
    status: [],
    tags: [],
  },
  conversationCache: {},
  hasMore: false,
  isInitialLoading: true,
  isRefetching: false,
  hasFetchedOnce: false,
  isLoadingMore: false,

  fetchConversations: async (accountId: string) => {
    try {
      const isFirstLoad = !get().hasFetchedOnce;
      set({
        currentAccountId: accountId,
        isInitialLoading: isFirstLoad,
        isRefetching: !isFirstLoad,
      });

      const query = get().conversationQuery;
      const queryKey = createCacheKey({
        search: query.search,
        platform: query.platform,
        status: query.status,
        tags: query.tags,
        accountId: accountId,
      });

      const cache = getCache(get().conversationCache, queryKey);

      if (cache && isCacheValid(cache.fetchedAt)) {
        set({
          conversations: cache?.data?.conversations || [],
          conversationQuery: {
            ...query,
          },
          isInitialLoading: false,
          isRefetching: false,
        });

        return;
      }

      const params = {
        accountId: accountId,
        page: 1,
        limit: query.limit,
        search: query.search,
        status: query.status,
        tags: query.tags,
        ...(query.platform !== "all" && {
          platform: query.platform,
        }),
      };

      const response = await conversationService.getConversation(params);
      const hasMore = response?.data?.meta?.hasNextPage || false;

      const conversations = response?.data?.docs || [];

      set({
        conversations,
        hasFetchedOnce: true,
        conversationCache: setCache({
          cache: get().conversationCache,
          key: queryKey,
          data: {
            conversations,
            currentPage: 1,
            hasMore,
          },
        }),
      });

      // auto select first conversation
      // const selectedConversationId = get().selectedConversationId;

      // if (!selectedConversationId && conversations.length > 0) {
      //   set({
      //     selectedConversationId: conversations[0]._id,
      //   });
      // }
    } catch (error) {
      console.error("Fetch conversations error", error);
    } finally {
      set({
        isInitialLoading: false,
        isRefetching: false,
      });
    }
  },

  setSelectConversationId: (conversationId: string) => {
    set({
      selectedConversationId: conversationId,
      isLoadingMore: false,
      conversations: get().conversations.map((conversation) => ({
        ...conversation,
        unreadCount:
          conversation.id === conversationId ? 0 : conversation.unreadCount,
      })),
    });
  },

  getSelectedConversation: () => {
    const { conversations, selectedConversationId } = get();
    return conversations.find(
      (conversation) => conversation.id === selectedConversationId,
    );
  },

  // updateConversationRealtime: ({ conversation }) => {
  //   set((state) => {
  //     const updatedConversations = [...state.conversations];

  //     const index = updatedConversations.findIndex(
  //       (item) => item._id === conversation._id,
  //     );

  //     // existing conversation
  //     if (index !== -1) {
  //       updatedConversations[index] = {
  //         ...updatedConversations[index],
  //         ...conversation,
  //       };

  //       const updatedConversation = updatedConversations[index];

  //       // move to top
  //       updatedConversations.splice(index, 1);

  //       updatedConversations.unshift(updatedConversation);

  //       return {
  //         conversations: updatedConversations,
  //       };
  //     }

  //     // new conversation (not loaded in pagination yet)
  //     updatedConversations.unshift(conversation);

  //     return {
  //       conversations: updatedConversations,
  //     };
  //   });
  // },

  updateConversationRealtime: ({
    conversation,
  }: {
    message: TMessage;
    conversation: TConversation;
  }) => {
    const updatedConversation = {
      ...conversation,
      unreadCount:
        conversation?.id === get().selectedConversationId
          ? 0
          : conversation.unreadCount,
    };
    set((state) => {
      const existingConversation = state.conversations.find(
        (item) => item.id === conversation.id,
      );

      // remove old conversation if exists
      const filteredConversations = state.conversations.filter(
        (item) => item.id !== conversation.id,
      );

      // prepend updated/new conversation
      return {
        conversations: [
          {
            ...(existingConversation || {}),
            ...updatedConversation,
          },
          ...filteredConversations,
        ],
      };
    });
  },
  updateConversationQuery: async (query) => {
    set((state) => ({
      conversationQuery: {
        ...state.conversationQuery,
        ...query,
      },
    }));

    const currentAccountId = get().currentAccountId;
    await get().fetchConversations(currentAccountId || "");
  },

  resetConversationQuery: async () => {
    set({
      conversationQuery: initialConversationQuery,
    });

    const currentAccountId = await get().currentAccountId;
    await get().fetchConversations(currentAccountId || "");
  },

  loadMoreConversations: async () => {
    try {
      const {
        currentAccountId,
        conversationQuery,
        conversations,
        conversationCache,
      } = get();

      if (!currentAccountId) return;

      const queryKey = createCacheKey({
        search: conversationQuery.search,
        platform: conversationQuery.platform,
        status: conversationQuery.status,
        tags: conversationQuery.tags,
        accountId: currentAccountId,
      });

      const cache = getCache(conversationCache, queryKey);

      const params = {
        accountId: currentAccountId,
        page: cache?.data?.currentPage + 1,
        limit: conversationQuery.limit,
        search: conversationQuery.search,
        status: conversationQuery.status,
        tags: conversationQuery.tags,
        ...(conversationQuery.platform !== "all" && {
          platform: conversationQuery.platform,
        }),
      };

      set({
        isLoadingMore: true,
      });

      if (!cache?.data?.hasMore) return;

      const response = await conversationService.getConversation(params);
      const newConversations = response?.data?.docs || [];
      const mergedConversations = [...conversations, ...newConversations];

      const hasMoreConversations = response?.data?.meta?.hasNextPage || false;
      const nextPage = cache?.data?.currentPage
        ? cache.data.currentPage + 1
        : 2;

      set({
        conversations: mergedConversations,
        conversationQuery: {
          ...conversationQuery,
        },
        conversationCache: setCache({
          cache: conversationCache,
          key: queryKey,
          data: {
            conversations: mergedConversations,
            currentPage: nextPage,
            hasMore: hasMoreConversations,
          },
        }),
        isLoadingMore: false,
      });
    } catch (error) {
      console.error("Load more conversations error", error);
    } finally {
      set({
        isLoadingMore: false,
      });
    }
  },
}));
