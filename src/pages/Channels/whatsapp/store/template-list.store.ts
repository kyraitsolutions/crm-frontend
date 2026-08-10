interface TemplateListState {
  // templates: TTemplate[] | [];
  templates: any[];

  loading: boolean;

  filters: any;

  pagination: Pagination;

  fetchTemplates(accountId: string): Promise<void>;

  setSearch(search: string): void;

  setStatus(status?: TemplateStatus): void;

  setCategory(category?: TemplateCategory): void;

  setLanguage(language?: string): void;

  setPage?(page: number): void;

  setLimit?(limit: number): void;

  setSortBy?(sortBy: string): void;

  setSortOrder?(order: "asc" | "desc"): void;

  resetFilters(): void;
}

import { create } from "zustand";

import type {
  TemplateCategory,
  TemplateStatus,
  // TTemplate,
} from "../types/templates";
import { whatsappTemplateService } from "../services/whatsapp-template.service";
import type { Pagination } from "@/types/pagination.type";

const defaultFilters = {
  search: "",
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

const defaultPagination = {
  page: 1,
  limit: 10,

  totalPages: 0,

  hasNextPage: false,
  hasPrevPage: false,
};

export const useTemplateListStore = create<TemplateListState>((set, get) => ({
  templates: [],

  loading: false,

  filters: defaultFilters,

  pagination: defaultPagination,

  fetchTemplates: async (accountId: string) => {
    try {
      set({ loading: true });

      const { filters } = get();

      const response = await whatsappTemplateService.getTemplates(
        accountId,
        filters,
      );

      set({
        templates: response.data?.docs ?? [],
        pagination: response.data?.pagination as any,
      });
    } finally {
      set({ loading: false });
    }
  },

  setSearch: (search) =>
    set((state) => ({
      filters: {
        ...state.filters,
        page: 1,
        search,
      },
    })),

  setStatus: (status) =>
    set((state) => ({
      filters: {
        ...state.filters,
        page: 1,
        status,
      },
    })),

  setCategory: (category) =>
    set((state) => ({
      filters: {
        ...state.filters,
        page: 1,
        category,
      },
    })),

  setLanguage: (language) =>
    set((state) => ({
      filters: {
        ...state.filters,
        page: 1,
        language,
      },
    })),

  setPage: (page) =>
    set((state) => ({
      filters: {
        ...state.filters,
        page,
      },
    })),

  resetFilters: () =>
    set({
      filters: defaultFilters,
    }),
}));
