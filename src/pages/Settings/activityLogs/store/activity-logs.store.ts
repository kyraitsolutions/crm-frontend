import { create } from "zustand";
import type { ActivityLog } from "../types/activity-log.type";
import {
  activityLogService,
  type ActivityLogQuery,
} from "../service/activity-log.service";

export type ActivityLogPagination = {
  page: number;
  totalPages: number;
  totalDocs: number;
};

interface ActivityLogState {
  logs: ActivityLog[];
  loading: boolean;
  pagination: ActivityLogPagination | null;
  getLogs: (accountId: string, query?: ActivityLogQuery) => Promise<void>;
  fetchLeadLogs: (accountId: string, leadId: string) => Promise<void>;
}

export const useActivityLogStore = create<ActivityLogState>((set) => ({
  logs: [],
  loading: false,
  pagination: null,

  getLogs: async (accountId, query) => {
    try {
      set({ loading: true });

      const response = await activityLogService.getLogs(accountId, {
        page: 1,
        limit: 20,
        ...query,
      });

      set({
        logs: response.data?.docs || [],
        pagination: (response.data?.pagination as ActivityLogPagination) || null,
      });
    } finally {
      set({
        loading: false,
      });
    }
  },

  async fetchLeadLogs(accountId, leadId) {
    try {
      set({ loading: true });

      const response = await activityLogService.getLeadLogs(accountId, leadId);

      set({
        logs: response.data?.docs || [],
        pagination: null,
      });
    } finally {
      set({
        loading: false,
      });
    }
  },
}));
