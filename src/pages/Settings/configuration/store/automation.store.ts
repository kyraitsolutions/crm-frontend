import { create } from "zustand";
import { automationService } from "../services/automation.service";
import type { ApiResponse } from "@/types";

export type TriggerType =
  | "lead_created"
  | "lead_stage_changed"
  | "lead_assigned"
  | "conversation_created"
  | "conversation_closed";

export type ActionType =
  | "assign_lead_to_user"
  | "create_task"
  | "send_notification";

export interface AutomationCondition {
  field: string;
  operator: string;
  values: string[] | [];
}

export interface AutomationAction {
  type: ActionType;
  config: Record<string, string>;
}

export interface Automation {
  id: string;
  name: string;
  trigger: TriggerType;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  isActive: boolean;
  status: "published" | "draft";
  createdAt: string;
}

export interface AutomationDraft {
  trigger: TriggerType | null;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
}

interface AutomationStore {
  automations: Automation[];
  loading: boolean;
  isCreating: boolean;
  isSaving: boolean;
  currentStep: number;
  draft: AutomationDraft;

  setIsCreating: (val: boolean) => void;
  setIsSaving: (val: boolean) => void;
  setCurrentStep: (step: number) => void;
  updateDraft: (patch: Partial<AutomationDraft>) => void;
  resetDraft: () => void;
  fetchAutomations: (accountId: string) => Promise<void>;
  saveAutomation: (
    accountId: string,
    data: { name: string; status: "published" | "draft" },
  ) => Promise<ApiResponse<Automation>>;
  toggleAutomation: (
    accountId: string,
    id: string,
    active: boolean,
  ) => Promise<ApiResponse<Automation> | undefined>;
  updateStatus: (
    accountId: string,
    id: string,
    status: "published" | "draft",
  ) => Promise<ApiResponse<Automation> | undefined>;
  deleteAutomation: (
    accountId: string,
    id: string,
  ) => Promise<ApiResponse<Automation>>;
}

const defaultDraft: AutomationDraft = {
  trigger: null,
  conditions: [],
  actions: [],
};

export const useAutomationStore = create<AutomationStore>((set, get) => ({
  automations: [],
  isCreating: false,
  isSaving: false,
  currentStep: 1,
  draft: defaultDraft,
  loading: false,

  setIsCreating: (val) =>
    set({ isCreating: val, currentStep: 1, draft: defaultDraft }),

  setIsSaving: (val) => set({ isSaving: val }),
  setCurrentStep: (step) => set({ currentStep: step }),
  updateDraft: (patch) =>
    set((state) => ({ draft: { ...state.draft, ...patch } })),
  resetDraft: () => set({ draft: defaultDraft, currentStep: 1 }),

  fetchAutomations: async (accountId) => {
    try {
      set({ loading: true });
      const response = await automationService.getAutomations(accountId);

      if (response.status === 200) {
        set({ automations: response.data.docs });
      }
    } finally {
      set({ loading: false });
    }
  },

  saveAutomation: async (accountId, data) => {
    set({ isSaving: true });
    const { draft } = get();
    const newAutomation = {
      name: data.name,
      status: data.status,
      trigger: draft.trigger!,
      conditions: draft.conditions,
      actions: draft.actions,
      isActive: true,
    };

    const response = await automationService.createAutomation({
      data: newAutomation,
      accountId,
    });

    set({
      automations: [...get().automations, response.data?.doc],
    });

    return response;
  },

  toggleAutomation: async (accountId, id, active) => {
    const previousAutomations = get().automations;
    try {
      set((state) => ({
        automations: state.automations.map((a) =>
          a.id === id ? { ...a, isActive: !a.isActive } : a,
        ),
      }));
      const response = await automationService.updateAutomation({
        accountId: String(accountId),
        id,
        data: { isActive: active },
      });

      return response;
    } catch (error) {
      set({
        automations: previousAutomations,
      });
      throw error;
    }
  },

  updateStatus: async (accountId, id, status) => {
    const previousAutomations = get().automations;
    try {
      set((state) => ({
        automations: state.automations.map((a) =>
          a.id === id ? { ...a, status } : a,
        ),
      }));

      const response = await automationService.updateAutomation({
        accountId: String(accountId),
        id,
        data: { status },
      });

      return response;
    } catch (error) {
      set({
        automations: previousAutomations,
      });
      throw error;
    }
  },

  deleteAutomation: async (accountId, id) => {
    const previousAutomations = get().automations;
    try {
      set((state) => ({
        automations: state.automations.filter((a) => a.id !== id),
      }));

      const response = await automationService.deleteAutomation(
        String(accountId),
        id,
      );

      return response;
    } catch (error) {
      set({
        automations: previousAutomations,
      });
      throw error;
    }
  },
}));
