import type { ILead } from "@/types/lead.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface ILeadsStoreState {
  leads: ILead[] | [];
  totalLeads: number | null;
}

export const useLeadsStore = create<ILeadsStoreState>()(
  immer(() => ({
    leads: [],
    totalLeads: null,
  }))
);

export class LeadsStoreManager {
  private store = useLeadsStore;

  constructor() {
    this.store = useLeadsStore;
  }

  setLeads(leads: ILead[]) {
    this.store.setState(() => ({
      leads: [...leads],
      totalLeads: leads.length,
    }));
  }

  setLeadsTop(lead: ILead) {
    this.store.setState((state) => ({
      leads: [lead, ...state.leads],
      totalLeads: state.totalLeads! + 1,
    }));
  }

  updateLead(updatedLead: ILead) {
    this.store.setState((state) => {
      const index = state.leads.findIndex(
        (lead) => lead._id === updatedLead._id
      );
      if (index !== -1) {
        state.leads[index] = updatedLead;
      }
    });
  }
}
