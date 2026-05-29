import { create } from "zustand";

interface ConfigurationStore {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useConfigurationStore = create<ConfigurationStore>((set) => ({
  activeTab: "lead-status",

  setActiveTab: (tab) =>
    set({
      activeTab: tab,
    }),
}));
