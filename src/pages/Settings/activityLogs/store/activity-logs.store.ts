import { create } from "zustand";
import type { ActivityLog } from "../types/activity-log.type";
import { activityLogService } from "../service/activity-log.service";

interface ActivityLogState {
  logs: ActivityLog[];
  loading: boolean;
  getLogs: (accountId: string) => Promise<void>;
  fetchLeadLogs: (accountId: string, leadId: string) => Promise<void>;
}

export const useActivityLogStore = create<ActivityLogState>((set) => ({
  logs: [],
  loading: false,

  getLogs: async (accountId) => {
    try {
      set({ loading: true });

      const response = await activityLogService.getLogs(accountId);

      set({
        logs: response.data.docs,
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
        logs: response.data.docs,
      });
    } finally {
      set({
        loading: false,
      });
    }
  },
}));
