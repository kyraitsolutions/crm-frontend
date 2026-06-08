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
  name: string;
  trigger: TriggerType;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  isActive: boolean;
  createdAt: string;
}

export interface AutomationDraft {
  trigger: TriggerType | null;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
}

interface AutomationStore {
  automations: Automation[];
  isCreating: boolean;
  isSaving: boolean;
  currentStep: number;
  draft: AutomationDraft;

  setIsCreating: (val: boolean) => void;
  setIsSaving: (val: boolean) => void;
  setCurrentStep: (step: number) => void;
  updateDraft: (patch: Partial<AutomationDraft>) => void;
  resetDraft: () => void;
  saveAutomation: (
    name: string,
    accountId: string,
  ) => Promise<ApiResponse<Automation>>;
  toggleAutomation: (id: string) => void;
  deleteAutomation: (id: string) => void;
}

const defaultDraft: AutomationDraft = {
  trigger: null,
  conditions: [],
  actions: [],
};

const sampleAutomations: Automation[] = [
  {
    id: "1",
    name: "Qualified Lead Assignment",
    trigger: "lead-status-changed",
    conditions: [
      { field: "Lead Status", operator: "Is Equal To", value: "Qualified" },
    ],
    actions: [
      { type: "assign-lead-to-user", config: { user: "Rahul Sharma" } },
      { type: "create-task", config: { title: "Follow up with lead" } },
    ],
    isActive: true,
    createdAt: "2024-01-15",
  },
];

export const useAutomationStore = create<AutomationStore>((set, get) => ({
  automations: sampleAutomations,
  isCreating: false,
  isSaving: false,
  currentStep: 1,
  draft: defaultDraft,

  setIsCreating: (val) =>
    set({ isCreating: val, currentStep: 1, draft: defaultDraft }),

  setIsSaving: (val) => set({ isSaving: val }),
  setCurrentStep: (step) => set({ currentStep: step }),
  updateDraft: (patch) =>
    set((state) => ({ draft: { ...state.draft, ...patch } })),
  resetDraft: () => set({ draft: defaultDraft, currentStep: 1 }),

  saveAutomation: async (name, accountId) => {
    set({ isSaving: true });
    const { draft } = get();
    const newAutomation = {
      name,
      trigger: draft.trigger!,
      conditions: draft.conditions,
      actions: draft.actions,
      isActive: true,
    };

    const response = await automationService.createAutomation({
      data: newAutomation,
      accountId,
    });

    return response;
  },

  toggleAutomation: (id) =>
    set((state) => ({
      automations: state.automations.map((a) =>
        a.id === id ? { ...a, isActive: !a.isActive } : a,
      ),
    })),

  deleteAutomation: (id) =>
    set((state) => ({
      // automations: state.automations.filter((a) => a.id !== id),
    })),
}));
