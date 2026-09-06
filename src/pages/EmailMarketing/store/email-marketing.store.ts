import { create } from "zustand";
import { emailMarketingService } from "../services/email-marketing.service";
import type { EmailCampaign, EmailTemplate } from "../types";

type State = {
  overview: any;
  campaigns: EmailCampaign[];
  templates: EmailTemplate[];
  loading: boolean;
  fetchOverview: (accountId: string) => Promise<void>;
  fetchCampaigns: (accountId: string, status?: string) => Promise<void>;
  fetchTemplates: (accountId: string) => Promise<void>;
};

export const useEmailMarketingStore = create<State>((set) => ({
  overview: null,
  campaigns: [],
  templates: [],
  loading: false,
  fetchOverview: async (accountId) => {
    set({ loading: true });
    try {
      const response = await emailMarketingService.overview(accountId);
      set({ overview: response.data?.doc || response.data });
    } finally {
      set({ loading: false });
    }
  },
  fetchCampaigns: async (accountId, status) => {
    set({ loading: true });
    try {
      const response = await emailMarketingService.listCampaigns(accountId, {
        status: status && status !== "ALL" ? status : undefined,
      });
      set({ campaigns: response.data?.docs || [] });
    } finally {
      set({ loading: false });
    }
  },
  fetchTemplates: async (accountId) => {
    set({ loading: true });
    try {
      const response = await emailMarketingService.templates(accountId);
      set({ templates: response.data?.docs || [] });
    } finally {
      set({ loading: false });
    }
  },
}));
