import type { ILead } from "@/types/lead.type";
import type { ILeadForm } from "@/types/leadform.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface ILeadsStoreState {
  leads: ILead[] | [];
  totalLeads: number | null;
  leadForms: ILeadForm[] | [];
}

export const useLeadsStore = create<ILeadsStoreState>()(
  immer<ILeadsStoreState>(() => ({
    leads: [],
    leadForms: [],
    totalLeads: null,
  })),
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
        (lead) => lead._id === updatedLead._id,
      );
      if (index !== -1) {
        state.leads[index] = updatedLead;
      }
    });
  }

  updateLeadOptimistic(updatedLead: ILead) {
    // Save previous state in case rollback is needed
    const prevLeads = this.store.getState().leads;

    // Update lead immediately
    this.updateLead(updatedLead);

    // Return rollback function
    return () => {
      this.store.setState(() => ({
        leads: prevLeads,
      }));
    };
  }

  deleteLeadOptimistic(leadId: string) {
    // Save previous state in case rollback is needed
    const prevLeads = this.store.getState().leads;
    const prevTotal = this.store.getState().totalLeads;

    // Delete lead immediately
    this.store.setState((state) => ({
      leads: state.leads.filter((lead) => lead._id !== leadId),
      totalLeads: state.totalLeads! - 1,
    }));

    // Return rollback function
    return () => {
      this.store.setState(() => ({
        leads: prevLeads,
        totalLeads: prevTotal,
      }));
    };
  }

  setLeadForm(leadForm: ILeadForm) {
    this.store.setState(() => ({
      leadForms: leadForm,
      totalLeads: 1,
    }));
  }

  setLeadFormTop(lead: ILeadForm) {
    this.store.setState((state) => ({
      leadForm: [lead, ...state.leadForms],
    }));
  }

  updateLeadFormStatus(formId: string, newStatus: boolean) {
    this.store.setState((state) => {
      state.leadForms = state.leadForms.map((leadForm) => {
        if (leadForm.id === formId) {
          return { ...leadForm, status: newStatus };
        }
        return leadForm;
      });
    });
  }

  updateFormStatusOptimistic(formId: string, newStatus: boolean) {
    // Save previous state in case rollback is needed
    const prevLeadForms = this.store.getState().leadForms;

    // Update lead immediately
    this.updateLeadFormStatus(formId, newStatus);

    // Return rollback function
    return () => {
      this.store.setState(() => ({
        leadForms: prevLeadForms,
      }));
    };
  }

  deleteLeadFormOptimistic(leadFormId: string) {
    // Save previous state in case rollback is needed
    const prevLeadForms = this.store.getState().leadForms;
    const prevTotal = this.store.getState().totalLeads;

    // Delete lead immediately
    this.store.setState((state) => ({
      leadForms: state.leadForms.filter((lead) => lead.id !== leadFormId),
      totalLeads: state.totalLeads! - 1,
    }));

    // Return rollback function
    return () => {
      this.store.setState(() => ({
        leadForms: prevLeadForms,
        totalLeads: prevTotal,
      }));
    };
  }
}
