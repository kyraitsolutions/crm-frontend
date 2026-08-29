import type {
  IntegrationProvider,
  TIntegrationResponse,
} from "@/types/integration.type";
import { create } from "zustand";
import { integrationService } from "../services/integration.service";

interface IntegrationStore {
  loading: boolean;
  integration: TIntegrationResponse | null;

  getIntegration: (
    provider: IntegrationProvider,
    accountId: string,
  ) => Promise<{ connected: boolean }>;

  clearIntegration: () => void;
}

export const useIntegrationStore = create<IntegrationStore>((set) => ({
  loading: false,
  integration: null,

  getIntegration: async (provider, accountId) => {
    try {
      set({
        loading: true,
      });

      const response = await integrationService.getIntegration({
        accountId: accountId,
        provider: provider,
      });

      set({
        integration: response.doc,
      });

      return response?.doc;
    } finally {
      set({
        loading: false,
      });
    }
  },

  clearIntegration: () => {
    set({
      integration: null,
    });
  },
}));
