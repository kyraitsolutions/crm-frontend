import { create } from "zustand";
import type { TCannedMessage } from "../types/canned-message.type";
import { whatsappCannedMessageService } from "../services/whatsapp-canned.service";

const CACHE_MS = 5 * 60 * 1000;

interface CannedMessageState {
  messages: TCannedMessage[];
  loading: boolean;
  error: string | null;
  fetchedAt: number | null;
  accountId: string | null;
  fetchMessages: (accountId: string, options?: { force?: boolean }) => Promise<void>;
  upsertMessage: (message: TCannedMessage) => void;
  removeMessage: (id: string) => void;
  markUsed: (accountId: string, id: string) => void;
}

export const useCannedMessageStore = create<CannedMessageState>((set, get) => ({
  messages: [],
  loading: false,
  error: null,
  fetchedAt: null,
  accountId: null,

  fetchMessages: async (accountId, options) => {
    const state = get();
    if (state.loading) return;
    const isFresh =
      !options?.force &&
      state.accountId === accountId &&
      state.fetchedAt &&
      Date.now() - state.fetchedAt < CACHE_MS;

    if (isFresh) return;

    try {
      set({ loading: true, error: null });
      const response = await whatsappCannedMessageService.list(accountId);
      set({
        messages: response.data?.docs ?? [],
        fetchedAt: Date.now(),
        accountId,
      });
    } catch (error) {
      const err = error as { message?: string };
      set({
        error: err?.message || "Failed to load canned messages",
      });
    } finally {
      set({ loading: false });
    }
  },

  upsertMessage: (message) =>
    set((state) => {
      const index = state.messages.findIndex((item) => item.id === message.id);
      if (index === -1) {
        return { messages: [message, ...state.messages] };
      }
      const next = [...state.messages];
      next[index] = message;
      return { messages: next };
    }),

  removeMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((item) => item.id !== id),
    })),

  markUsed: (accountId, id) => {
    set((state) => ({
      messages: state.messages.map((item) =>
        item.id === id
          ? {
              ...item,
              usageCount: (item.usageCount || 0) + 1,
              lastUsedAt: new Date().toISOString(),
            }
          : item,
      ),
    }));
    void whatsappCannedMessageService.markUsed(accountId, id).catch(() => undefined);
  },
}));
