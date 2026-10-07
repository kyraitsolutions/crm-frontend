import { create } from "zustand";
import { automationService } from "../services/automation.service";
import type { ApiResponse } from "@/types";
import { normalizeTriggerKey } from "../constants/automation.constants";

export type TriggerType =
  | "lead_created"
  | "lead_stage_changed"
  | "lead_assigned"
  | "conversation_created"
  | "conversation_closed"
  | "contact_created";

export type ActionType =
  | "assign_lead_to_user"
  | "create_task"
  | "send_notification"
  | "update_lead_stage"
  | "add_lead_tag";

export interface AutomationCondition {
  field: string;
  operator: string;
  values: string[];
}

export interface AutomationAction {
  type: ActionType;
  config: Record<string, string>;
}

export interface Automation {
  id: string;
  name: string;
  trigger: TriggerType | string;
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
  name: string;
}

interface AutomationStore {
  automations: Automation[];
  loading: boolean;
  isCreating: boolean;
  editingId: string | null;
  isSaving: boolean;
  currentStep: number;
  draft: AutomationDraft;

  setIsCreating: (val: boolean) => void;
  startEditing: (automation: Automation) => void;
  setIsSaving: (val: boolean) => void;
  setCurrentStep: (step: number) => void;
  updateDraft: (patch: Partial<AutomationDraft>) => void;
  resetDraft: () => void;
  fetchAutomations: (accountId: string) => Promise<void>;
  saveAutomation: (
    accountId: string,
    data: { name: string; status: "published" | "draft" },
  ) => Promise<ApiResponse<any>>;
  toggleAutomation: (
    accountId: string,
    id: string,
    active: boolean,
  ) => Promise<ApiResponse<any> | undefined>;
  updateStatus: (
    accountId: string,
    id: string,
    status: "published" | "draft",
  ) => Promise<ApiResponse<any> | undefined>;
  deleteAutomation: (
    accountId: string,
    id: string,
  ) => Promise<ApiResponse<any>>;
}

const defaultDraft: AutomationDraft = {
  trigger: null,
  conditions: [],
  actions: [],
  name: "",
};

function mapDoc(doc: any): Automation {
  return {
    id: String(doc?.id || doc?._id),
    name: String(doc?.name || ""),
    trigger: normalizeTriggerKey(doc?.trigger) as TriggerType,
    conditions: Array.isArray(doc?.conditions) ? doc.conditions : [],
    actions: Array.isArray(doc?.actions) ? doc.actions : [],
    isActive: Boolean(doc?.isActive),
    status: doc?.status === "published" ? "published" : "draft",
    createdAt: String(doc?.createdAt || ""),
  };
}

export const useAutomationStore = create<AutomationStore>((set, get) => ({
  automations: [],
  isCreating: false,
  editingId: null,
  isSaving: false,
  currentStep: 1,
  draft: defaultDraft,
  loading: false,

  setIsCreating: (val) =>
    set({
      isCreating: val,
      editingId: null,
      currentStep: 1,
      draft: defaultDraft,
    }),

  startEditing: (automation) =>
    set({
      isCreating: true,
      editingId: automation.id,
      currentStep: 1,
      draft: {
        trigger: normalizeTriggerKey(automation.trigger) as TriggerType,
        conditions: automation.conditions || [],
        actions: (automation.actions || []) as AutomationAction[],
        name: automation.name || "",
      },
    }),

  setIsSaving: (val) => set({ isSaving: val }),
  setCurrentStep: (step) => set({ currentStep: step }),
  updateDraft: (patch) =>
    set((state) => ({ draft: { ...state.draft, ...patch } })),
  resetDraft: () =>
    set({ draft: defaultDraft, currentStep: 1, editingId: null }),

  fetchAutomations: async (accountId) => {
    try {
      set({ loading: true });
      const response = await automationService.getAutomations(accountId);

      if (response.status === 200) {
        const docs = response.data?.docs || [];
        set({ automations: docs.map(mapDoc) });
      }
    } finally {
      set({ loading: false });
    }
  },

  saveAutomation: async (accountId, data) => {
    set({ isSaving: true });
    const { draft, editingId } = get();
    const payload = {
      name: data.name,
      status: data.status,
      trigger: draft.trigger!,
      conditions: draft.conditions,
      actions: draft.actions,
      isActive: true,
    };

    try {
      if (editingId) {
        const response = await automationService.updateAutomation({
          accountId,
          id: editingId,
          data: payload,
        });
        const doc = mapDoc(response.data?.doc || { ...payload, id: editingId });
        set({
          automations: get().automations.map((a) =>
            a.id === editingId ? doc : a,
          ),
          isCreating: false,
          editingId: null,
          draft: defaultDraft,
          currentStep: 1,
        });
        return response;
      }

      const response = await automationService.createAutomation({
        data: payload,
        accountId,
      });
      const doc = mapDoc(response.data?.doc);
      set({
        automations: [...get().automations, doc],
        isCreating: false,
        editingId: null,
        draft: defaultDraft,
        currentStep: 1,
      });
      return response;
    } finally {
      set({ isSaving: false });
    }
  },

  toggleAutomation: async (accountId, id, active) => {
    const previousAutomations = get().automations;
    try {
      set((state) => ({
        automations: state.automations.map((a) =>
          a.id === id ? { ...a, isActive: active } : a,
        ),
      }));
      return await automationService.updateAutomation({
        accountId: String(accountId),
        id,
        data: { isActive: active },
      });
    } catch (error) {
      set({ automations: previousAutomations });
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

      return await automationService.updateAutomation({
        accountId: String(accountId),
        id,
        data: { status },
      });
    } catch (error) {
      set({ automations: previousAutomations });
      throw error;
    }
  },

  deleteAutomation: async (accountId, id) => {
    const previousAutomations = get().automations;
    try {
      set((state) => ({
        automations: state.automations.filter((a) => a.id !== id),
      }));

      return await automationService.deleteAutomation(String(accountId), id);
    } catch (error) {
      set({ automations: previousAutomations });
      throw error;
    }
  },
}));
