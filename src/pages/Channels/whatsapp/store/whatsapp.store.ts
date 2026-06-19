import { integrationService } from "@/services/integration.service";
import { create } from "zustand";
import type { WhatsAppTab } from "../types/whatsapp.type";
import { whatsappService } from "../services/whatsapp.service";

interface WhatsAppStore {
  loading: boolean;
  connecting: boolean;
  isConnected: boolean;
  profile: any | null;
  activeTab: WhatsAppTab;

  setActiveTab: (tab: WhatsAppTab) => void;
  fetchProfile: () => Promise<void>;
  registerPhoneNumber: (payload: {
    accountId: string;
    pin: string;
  }) => Promise<{ success: boolean }>;
  connect: (accountId: string) => Promise<{ connectUrl: string }>;
  reset: () => void;
}

const initialState = {
  loading: false,
  connecting: false,
  isConnected: false,
  profile: null,
  activeTab: "overview" as WhatsAppTab,
};

export const useWhatsAppStore = create<WhatsAppStore>((set) => ({
  ...initialState,
  setActiveTab: (tab) =>
    set({
      activeTab: tab,
    }),

  fetchProfile: async () => {
    try {
      set({
        loading: true,
      });

      const response = {
        connected: false,
        data: null,
      };

      set({
        isConnected: response.connected,

        profile: response.data ?? null,
      });
    } catch {
      set({
        isConnected: false,
        profile: null,
      });
    } finally {
      set({
        loading: false,
      });
    }
  },

  registerPhoneNumber: async (payload: { accountId: string; pin: string }) => {
    try {
      const response = await whatsappService.registerPhoneNumber(payload);
      return response.data?.doc;
    } finally {
      set({
        loading: false,
      });
    }
  },

  connect: async (accountId: string) => {
    try {
      set({connecting: true});

      const response = await integrationService.connectWhatsApp(accountId);
      return response.doc;
    } finally {
      set({connecting: false,});
    }
  },

  reset: () => {
    set(initialState);
  },
}));
