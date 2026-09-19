import { create } from "zustand";
import { metaService } from "../services/meta.service";
import type {
  TFacebookInsightMetric,
  TFacebookInsights,
  TFacebookLead,
  TFacebookLeadForm,
  TFacebookPost,
  TMetaPaginatedResponse,
} from "../types/meta-page.type";

interface MetaPageStore {
  posts: TFacebookPost[];
  postsWarning: string | null;
  postsLoading: boolean;
  postsPage: number;
  postsTotalPages: number;
  fetchPosts: (accountId: string, page?: number) => Promise<void>;

  forms: TFacebookLeadForm[];
  formsWarning: string | null;
  formsLoading: boolean;
  formsPage: number;
  formsTotalPages: number;
  fetchForms: (accountId: string, page?: number) => Promise<void>;

  leads: TFacebookLead[];
  leadsWarning: string | null;
  leadsLoading: boolean;
  leadsPage: number;
  leadsTotalPages: number;
  leadsTotal: number;
  fetchLeads: (
    accountId: string,
    params?: { page?: number; search?: string },
  ) => Promise<void>;

  insights: TFacebookInsights | null;
  insightsLoading: boolean;
  fetchInsights: (accountId: string) => Promise<void>;
}

const readPaginated = <T>(
  response: TMetaPaginatedResponse<T> | undefined,
  fallbackPage = 1,
) => ({
  docs: (response?.docs ?? []) as T[],
  warning: response?.warning ?? null,
  page: response?.pagination?.page ?? fallbackPage,
  totalPages: response?.pagination?.totalPages ?? 1,
  totalDocs: response?.pagination?.totalDocs ?? 0,
});

export const useMetaPageStore = create<MetaPageStore>((set) => ({
  posts: [],
  postsWarning: null,
  postsLoading: false,
  postsPage: 1,
  postsTotalPages: 1,

  forms: [],
  formsWarning: null,
  formsLoading: false,
  formsPage: 1,
  formsTotalPages: 1,

  leads: [],
  leadsWarning: null,
  leadsLoading: false,
  leadsPage: 1,
  leadsTotalPages: 1,
  leadsTotal: 0,

  insights: null,
  insightsLoading: false,

  fetchPosts: async (accountId, page = 1) => {
    set({ postsLoading: true });

    try {
      const response = await metaService.getPosts(accountId, {
        page,
        limit: 12,
      });
      const result = readPaginated<TFacebookPost>(response, page);

      set({
        posts: result.docs,
        postsWarning: result.warning,
        postsPage: result.page,
        postsTotalPages: result.totalPages,
        postsLoading: false,
      });
    } catch (error) {
      set({ postsLoading: false });
      throw error;
    }
  },

  fetchForms: async (accountId, page = 1) => {
    set({ formsLoading: true });

    try {
      const response = await metaService.getLeadForms(accountId, {
        page,
        limit: 25,
      });
      const result = readPaginated<TFacebookLeadForm>(response, page);

      set({
        forms: result.docs,
        formsWarning: result.warning,
        formsPage: result.page,
        formsTotalPages: result.totalPages,
        formsLoading: false,
      });
    } catch (error) {
      set({ formsLoading: false });
      throw error;
    }
  },

  fetchLeads: async (accountId, params) => {
    set({ leadsLoading: true });

    try {
      const response = await metaService.getLeads(accountId, {
        page: params?.page ?? 1,
        limit: 20,
        search: params?.search,
      });
      const result = readPaginated<TFacebookLead>(response, params?.page ?? 1);

      set({
        leads: result.docs,
        leadsWarning: result.warning,
        leadsPage: result.page,
        leadsTotalPages: result.totalPages,
        leadsTotal: result.totalDocs,
        leadsLoading: false,
      });
    } catch (error) {
      set({ leadsLoading: false });
      throw error;
    }
  },

  fetchInsights: async (accountId) => {
    set({ insightsLoading: true });

    try {
      const response = await metaService.getInsights(accountId);
      const doc = response?.doc as TFacebookInsights | undefined;

      set({
        insights: doc
          ? {
              ...doc,
              metrics: (doc.metrics ?? []) as TFacebookInsightMetric[],
            }
          : null,
        insightsLoading: false,
      });
    } catch (error) {
      set({ insightsLoading: false });
      throw error;
    }
  },
}));
