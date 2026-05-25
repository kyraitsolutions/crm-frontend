import { create } from "zustand";
import { dashboardService } from "../services/dashboardService";

interface DashboardStore {
  loading: boolean;
  dashboardOverview: any;
  filters?: {
    module?: string;
    range?: string;
    startDate?: string;
    endDate?: string;
  };

  setFilters: (filters: Partial<DashboardStore["filters"]>) => void;
  fetchDashboardOverview: (accountId: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  loading: false,
  dashboardOverview: null,

  setFilters: (filters) => {
    set({
      filters: {
        ...get().filters,
        ...filters,
      },
    });
  },

  fetchDashboardOverview: async (accountId: string) => {
    try {
      set({ loading: true });
      const response = await dashboardService.getDashboardOverview({
        accountId,
        ...get().filters,
      });

      set({
        dashboardOverview: response.data.doc,
      });
    } finally {
      set({ loading: false });
    }
  },
}));
