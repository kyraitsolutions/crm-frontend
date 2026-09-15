import { create } from "zustand";
import { metaService } from "../services/meta.service";
import type { MetaTab } from "../types/meta.type";

interface MetaStore {
  loading: boolean;
  connecting: boolean;
  isConnected: boolean;
  activeTab: MetaTab;
  setActiveTab: (tab: MetaTab) => void;
  setConnecting: (connecting: boolean) => void;
  connect: (payload: { accountId: string }) => Promise<{ signupUrl: string }>;
  disconnect: (accountId: string, integrationId: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  loading: false,
  connecting: false,
  isConnected: false,
  activeTab: "overview" as MetaTab,
};

export const useMetaStore = create<MetaStore>((set) => ({
  ...initialState,

  setActiveTab: (tab) =>
    set({
      activeTab: tab,
    }),

  setConnecting: (connecting) => set({ connecting }),

  connect: async (payload) => {
    try {
      set({ connecting: true });
      const response = await metaService.connect(payload);
      return response?.doc;
    } catch (error) {
      set({ connecting: false });
      throw error;
    }
  },

  disconnect: async (accountId, integrationId) => {
    try {
      set({ connecting: true });
      const response = await metaService.disconnect({
        accountId,
        integrationId,
      });
      return response?.doc;
    } finally {
      set({ connecting: false });
    }
  },

  reset: () => {
    set(initialState);
  },
}));
