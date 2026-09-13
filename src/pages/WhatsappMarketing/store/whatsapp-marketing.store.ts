import { create } from "zustand";
import { whatsappBroadcastService } from "../services/whatsapp-broadcast.service";

type State = {
  overview: any;
  campaigns: any[];
  templates: any[];
  context: any;
  loading: boolean;
  fetchOverview: (accountId: string) => Promise<void>;
  fetchCampaigns: (accountId: string, status?: string) => Promise<void>;
  fetchTemplates: (accountId: string) => Promise<void>;
  fetchContext: (accountId: string) => Promise<void>;
};

export const useWhatsAppMarketingStore = create<State>((set) => ({
  overview: null,
  campaigns: [],
  templates: [],
  context: null,
  loading: false,
  fetchOverview: async (accountId) => {
    set({ loading: true });
    try {
      const response = await whatsappBroadcastService.overview(accountId);
      set({ overview: response.data?.doc || response.data });
    } finally {
      set({ loading: false });
    }
  },
  fetchCampaigns: async (accountId, status) => {
    set({ loading: true });
    try {
      const response = await whatsappBroadcastService.listCampaigns(accountId, {
        status: status && status !== "ALL" ? status : undefined,
      });
      set({ campaigns: response.data?.docs || [] });
    } finally {
      set({ loading: false });
    }
  },
  fetchTemplates: async (accountId) => {
    const response = await whatsappBroadcastService.templates(accountId);
    set({ templates: response.data?.docs || [] });
  },
  fetchContext: async (accountId) => {
    const response = await whatsappBroadcastService.context(accountId);
    set({ context: response.data?.doc || response.data });
  },
}));
