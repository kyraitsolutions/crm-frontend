import { create } from "zustand";
import { configurationService } from "../services/configuration.service";
import { CONFIGURATION_MAP } from "../constants/configuration.constants";
import type { ApiResponse } from "@/types";

interface ConfigurationItem {
  _id: string;
  key: string;
  label: string;
  color?: string;
  system?: boolean;
  order?: number;
}

interface ConfigurationState {
  activeTab: string;
  loading: boolean;
  configurationItems: ConfigurationItem[];
  configId?: string | null;
  setActiveTab: (tab: string) => void;

  getConfigurations: () => Promise<void>;
  createConfigurationItem: (payload: any) => Promise<ApiResponse<any>>;
  deleteConfigurationItem: (itemId: string) => Promise<ApiResponse<any>>;
}

export const useConfigurationStore = create<ConfigurationState>((set, get) => ({
  activeTab: "lead-status",
  loading: false,
  configurationItems: [],

  setActiveTab: (tab) =>
    set({
      activeTab: tab,
    }),

  getConfigurations: async () => {
    try {
      set({
        loading: true,
      });
      const activeTab = get().activeTab;
      const config =
        CONFIGURATION_MAP[activeTab as keyof typeof CONFIGURATION_MAP];

      const params = {
        module: config.module,
        configType: config.configType,
      };

      const response = await configurationService.getConfigurations(params);

      set({
        configurationItems: response.data.doc?.values,
        configId: response.data.doc?.id,
      });
    } finally {
      set({
        loading: false,
      });
    }
  },
  createConfigurationItem: async (payload: any) => {
    const configId = get().configId as string;
    const response = await configurationService.createConfigurationsItem(
      configId,
      payload,
    );
    await get().getConfigurations();

    return response;
  },

  deleteConfigurationItem: async (itemId: string) => {
    const configId = get().configId;

    if (!configId) {
      throw new Error("Configuration id not found");
    }
    const response = await configurationService.deleteConfigurationItem(
      configId,
      itemId,
    );
    await get().getConfigurations();

    return response;
  },
}));
