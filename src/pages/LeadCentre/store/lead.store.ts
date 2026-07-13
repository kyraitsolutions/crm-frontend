import { create } from "zustand";

import { leadService } from "../services/lead.service";

import type { ApiResponse } from "@/types";
import type { ILead, Path } from "../types/lead.type";

export type TLeadQuery = {
  limit: number;
  search: string;
  source: string;
  status: string;
  stage: string;
  assignedTo: string;
  form: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  } | null;
  read: boolean | null;
  tags: string[];
};

export const initialLeadQuery: TLeadQuery = {
  limit: 10,
  search: "",
  source: "",
  status: "",
  stage: "",
  assignedTo: "",
  form: "",
  sortBy: "",
  sortOrder: "desc",
  dateRange: {
    startDate: "",
    endDate: "",
  },
  read: null,
  tags: [],
};

interface ILeadsStoreState {
  leads: ILead[];

  selectedLead: ILead | null;

  loadingLeads: boolean;
  updatingLead: boolean;

  currentPage: number;
  totalPages: number;
  totalItems: number;

  editingField: keyof ILead | null;

  leadQuery: TLeadQuery;

  setLeadQuery: (query: Partial<TLeadQuery>) => void;

  resetLeadQuery: () => void;

  setCurrentPage: (page: number) => void;

  setEditingField: (field: keyof ILead | null) => void;

  setSelectedLead: (lead: ILead | null) => void;

  fetchLeads: (accountId: string) => Promise<void>;

  updateLeadField: (
    accountId: string,
    leadId: string,
    field: Path<ILead>,
    value: unknown,
  ) => Promise<ApiResponse<ILead>>;

  addLead: (accountId: string, payload: unknown) => Promise<void>;
}

export const useLeadsStore = create<ILeadsStoreState>((set, get) => ({
  leads: [],

  selectedLead: null,

  loadingLeads: false,
  updatingLead: false,

  currentPage: 1,
  totalPages: 1,
  totalItems: 0,

  editingField: null,

  leadQuery: initialLeadQuery,

  setLeadQuery: (query) =>
    set((state) => ({
      leadQuery: {
        ...state.leadQuery,
        ...query,
      },
      currentPage: 1,
    })),

  resetLeadQuery: () =>
    set({
      leadQuery: initialLeadQuery,
      currentPage: 1,
    }),

  setCurrentPage: (page) => {
    if (page === get().currentPage) return;

    set({
      currentPage: page,
    });
  },

  setEditingField: (field) =>
    set({
      editingField: field,
    }),

  setSelectedLead: (lead) =>
    set({
      selectedLead: lead,
    }),

  fetchLeads: async (accountId) => {
    const { currentPage, leadQuery } = get();

    try {
      set({
        loadingLeads: true,
      });

      const response = await leadService.getLeads(accountId, {
        page: currentPage,
        limit: leadQuery.limit,
        search: leadQuery.search.trim() || undefined,

        filters: {
          source: leadQuery.source || undefined,
          status: leadQuery.status || undefined,
          stage: leadQuery.stage || undefined,
        },

        assignedTo: leadQuery.assignedTo || undefined,
        form: leadQuery.form || undefined,
        read: leadQuery.read,

        dateRange: leadQuery.dateRange,

        sort: {
          field: leadQuery.sortBy || undefined,
          order: leadQuery.sortOrder,
        },
      });

      set({
        leads: response.data.docs,
        totalPages: response?.data?.pagination?.totalPages,
        totalItems: response?.data?.pagination?.totalDocs,
      });
    } catch (error) {
      console.error("Failed to fetch leads", error);
    } finally {
      set({
        loadingLeads: false,
      });
    }
  },

  updateLeadField: async (accountId, leadId, field, value) => {
    const previousLeads = get().leads;
    const previousLead = get().selectedLead;

    try {
      set({
        updatingLead: true,
      });

      set((state) => ({
        leads: state.leads.map((lead) =>
          lead.id === leadId
            ? {
                ...lead,
                [field]: value,
              }
            : lead,
        ),

        selectedLead:
          state.selectedLead?.id === leadId
            ? {
                ...state.selectedLead,
                [field]: value,
              }
            : state.selectedLead,
      }));

      const response = await leadService.updateLead(accountId, {
        id: leadId,
        [field]: value,
      });

      set({
        editingField: null,
      });

      return response;
    } catch (error) {
      set({
        leads: previousLeads,
        selectedLead: previousLead,
      });

      throw error;
    } finally {
      set({
        updatingLead: false,
      });
    }
  },

  addLead: async (accountId: string, payload: any) => {
    await leadService.createLead(accountId, payload);
  },
}));

// import { create } from "zustand";
// import { leadService } from "../services/lead.service";
// import type { ILead } from "../types/lead.type";
// import type { ApiResponse } from "@/types";

// interface ILeadsStoreState {
//   leads: ILead[] | [];
//   totalItems: number | null;
//   //   leadForms: ILeadForm[] | [];
//   currentPage: number;
//   totalPages: number;
//   editingField: string | null;
//   updatingLead: boolean;
//   loadingLeads: boolean;
//   leadQuery: TLeadQuery;
//   setLeadQuery: (query: Partial<TLeadQuery>) => void;
//   openSort: boolean;
//   selectedLead: ILead | null;

//   setOpenSort: (openSort: boolean) => void;
//   setEditingField: (field: string | null) => void;
//   setCurrentPage: (page: number) => void;
//   fetchLeads: (accountId: string) => Promise<void>;
//   updateLeadField: (
//     accountId: string,
//     leadId: string,
//     field: keyof ILead,
//     value: any,
//   ) => Promise<ApiResponse<ILead>>;
//   addLead: (accountId: string, payload: any) => Promise<void>;
//   setSelectedLead: (lead: ILead | null) => void;
// }
// type TLeadQuery = {
//   limit: number;
//   search: string;
//   source: string;
//   status: string;
//   stage: string;
//   assignedTo: string;
//   form: string;
//   sortBy: string;
//   sortOrder: "asc" | "desc";
//   dateRange: {
//     startDate: string | null;
//     endDate: string | null;
//   } | null;
//   read: boolean | null;
//   tags: string[];
// };

// const initialLeadQuery: TLeadQuery = {
//   limit: 10,
//   search: "",
//   source: "",
//   status: "",
//   stage: "",
//   assignedTo: "",
//   form: "",
//   sortBy: "",
//   sortOrder: "desc",
//   dateRange: {
//     startDate: "",
//     endDate: "",
//   },
//   read: null,
//   tags: [],
// };

// export const useLeadsStore = create<ILeadsStoreState>((set, get) => ({
//   leads: [],
//   loadingLeads: false,

//   currentPage: 1,
//   totalPages: 1,
//   totalItems: 10,

//   editingField: null,
//   updatingLead: false,

//   leadQuery: initialLeadQuery,

//   openSort: false,

//   selectedLead: null,

//   setLeadQuery: (query) => {
//     set((state) => ({
//       leadQuery: {
//         ...state.leadQuery,
//         ...query,
//       },
//       currentPage: 1,
//     }));
//   },

//   setEditingField: (field) => {
//     set({
//       editingField: field,
//     });
//   },
//   setOpenSort: (openSort) => {
//     set({ openSort: openSort });
//   },
//   setCurrentPage: (page) => {
//     const current = get().currentPage;

//     if (current === page) return;

//     set({ currentPage: page });
//   },
//   fetchLeads: async (accountId) => {
//     try {
//       set({ loadingLeads: true });
//       const { leadQuery, currentPage } = get();

//       const payload = {
//         page: currentPage,
//         limit: leadQuery.limit,
//         search: leadQuery.search?.trim() || undefined,
//         filters: {
//           stage: leadQuery.stage || "",
//           status: leadQuery.status || "",
//           source: leadQuery.source || "",
//         },

//         assignedTo: leadQuery.assignedTo || "",
//         form: leadQuery.form || "",
//         dateRange: leadQuery.dateRange,
//         read: leadQuery.read,
//         sort: {
//           field: leadQuery.sortBy || undefined,
//           order: leadQuery.sortOrder,
//         },
//       };

//       const response = await leadService.getLeads(String(accountId), payload);

//       const leads = response.data.docs;
//       set({
//         leads,
//         totalPages: response.data?.pagination?.totalPages,
//         totalItems: response.data.pagination?.totalDocs,
//       });
//     } catch (error) {
//       console.error("Fetch leads error", error);
//     } finally {
//       set({ loadingLeads: false });
//     }
//   },
//   updateLeadField: async (accountId, leadId, field, value) => {
//     const prevLeads = get().leads;
//     const prevLead = get().selectedLead;

//     try {
//       set({ updatingLead: true });

//       // Optimistic update
//       set((state) => ({
//         // leads: state.leads.map((lead) =>
//         //   lead.id === leadId
//         //     ? {
//         //         ...lead,
//         //         [field]: value,
//         //       }
//         //     : lead,
//         // ),

//         selectedLead:
//           state.selectedLead?.id === leadId
//             ? {
//                 ...state.selectedLead,
//                 [field]: value,
//               }
//             : state.selectedLead,
//       }));

//       // Partial payload only
//       const payload = { id: leadId, [field]: value };
//       const response = await leadService.updateLead(accountId, payload);
//       set({ editingField: null });
//       return response;
//     } catch (error) {
//       // rollback
//       set({ leads: prevLeads, selectedLead: prevLead });
//       throw error;
//     } finally {
//       set({ updatingLead: false });
//     }
//   },
//   addLead: async (accountId, payload) => {
//     try {
//       console.log(payload);
//       await leadService.createLead(accountId, payload);
//     } catch (error) {
//       console.error("Error creating lead", error);
//     }
//   },

//   setSelectedLead: (lead) => set({ selectedLead: lead }),
// }));

// export class LeadsStoreManager {
//   private store = useLeadsStore;

//   constructor() {
//     this.store = useLeadsStore;
//   }

//   setLeads(leads: ILead[]) {
//     this.store.setState(() => ({
//       leads: [...leads],
//       totalLeads: leads.length,
//     }));
//   }

//   setLeadsTop(lead: ILead) {
//     this.store.setState((state) => ({
//       leads: [lead, ...state.leads],
//       totalLeads: state.totalLeads! + 1,
//     }));
//   }

//   updateLead(updatedLead: ILead) {
//     this.store.setState((state) => {
//       const index = state.leads.findIndex(
//         (lead) => lead._id === updatedLead._id,
//       );
//       if (index !== -1) {
//         state.leads[index] = updatedLead;
//       }
//     });
//   }

//   updateLeadOptimistic(updatedLead: ILead) {
//     // Save previous state in case rollback is needed
//     const prevLeads = this.store.getState().leads;

//     // Update lead immediately
//     this.updateLead(updatedLead);

//     // Return rollback function
//     return () => {
//       this.store.setState(() => ({
//         leads: prevLeads,
//       }));
//     };
//   }

//   deleteLeadOptimistic(leadId: string) {
//     // Save previous state in case rollback is needed
//     const prevLeads = this.store.getState().leads;
//     const prevTotal = this.store.getState().totalLeads;

//     // Delete lead immediately
//     this.store.setState((state) => ({
//       leads: state.leads.filter((lead) => lead._id !== leadId),
//       totalLeads: state.totalLeads! - 1,
//     }));

//     // Return rollback function
//     return () => {
//       this.store.setState(() => ({
//         leads: prevLeads,
//         totalLeads: prevTotal,
//       }));
//     };
//   }
// }
