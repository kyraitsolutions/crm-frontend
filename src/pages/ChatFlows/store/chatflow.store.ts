import { create } from "zustand";
import type { TChatFlow } from "../types/chatflow.type";
import { chatflowService } from "../services/chatflow.service";
import type { ApiResponse } from "@/types";

type TChatFlowStore = {
  flows: TChatFlow[];

  selectedFlow: TChatFlow | null;

  isLoading: boolean;

  error: string | null;

  fetchFlows: (accountId: string) => Promise<void>;
  setFlows: (flows: TChatFlow[]) => void;
  setSelectedFlow: (flow: TChatFlow | null) => void;
  addFlow: (flow: TChatFlow) => void;
  updateFlow: (flowId: string, updatedFlow: Partial<TChatFlow>) => void;
  deleteFlow: (flowId: string) => Promise<ApiResponse<any>>;
  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  reset: () => void;
};

const initialState = {
  flows: [],
  selectedFlow: null,
  isLoading: false,
  error: null,
};

export const useChatFlowStore = create<TChatFlowStore>((set) => ({
  ...initialState,

  fetchFlows: async (accountId) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await chatflowService.getAllChatFlow(accountId);
      const data = (response?.data?.docs as TChatFlow[]) || [];

      set({
        flows: data,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Something went wrong",
        isLoading: false,
      });
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  setFlows: (flows) => {
    set({
      flows,
    });
  },

  setSelectedFlow: (flow) => {
    set({
      selectedFlow: flow,
    });
  },

  addFlow: (flow) => {
    set((state) => ({
      flows: [flow, ...state.flows],
    }));
  },

  updateFlow: (flowId, updatedFlow) => {
    set((state) => ({
      flows: state.flows.map((flow) =>
        flow.id === flowId
          ? {
              ...flow,
              ...updatedFlow,
            }
          : flow,
      ),

      selectedFlow:
        state.selectedFlow?.id === flowId
          ? {
              ...state.selectedFlow,
              ...updatedFlow,
            }
          : state.selectedFlow,
    }));
  },
  deleteFlow: async (flowId) => {
    set((state) => ({
      flows: state.flows.filter((flow) => flow.id !== flowId),

      selectedFlow:
        state.selectedFlow?.id === flowId ? null : state.selectedFlow,
    }));

    try {
      const response = await chatflowService.deleteChatFlow(flowId);

      return response;
    } catch (error) {
      console.log(error);

      throw error;
    }
  },

  setLoading: (value) => {
    set({
      isLoading: value,
    });
  },

  setError: (value) => {
    set({
      error: value,
    });
  },

  reset: () => {
    set(initialState);
  },
}));
