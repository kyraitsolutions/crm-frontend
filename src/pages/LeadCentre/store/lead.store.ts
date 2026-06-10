


import { create } from "zustand";
import { leadService } from "../services/lead.service";
import type { ILead } from "../types/lead.type";

interface ILeadsStoreState {
    leads: ILead[] | [];
    totalItems: number | null;
    //   leadForms: ILeadForm[] | [];
    currentPage:number;
    totalPages:number;
    editingField: string | null;
    updatingLead: boolean;
    loadingLeads:boolean;
    leadQuery:TLeadQuery;
    setLeadQuery: (query: Partial<TLeadQuery>) => void;
    openSort: boolean;
    setOpenSort: (openSort: boolean) => void;
    setEditingField:(field: string | null) => void;
    setCurrentPage: (page: number) => void;
    fetchLeads:(accountId: string) => Promise<void>;
    updateLeadField: (accountId:string,leadId: string,field: keyof ILead,value: any) => Promise<void>;
    addLead:(accountId:string,payload:any)=>Promise<void>;
}


type TLeadQuery = {
    limit: number;
    search: string;
    source: string;
    status: string;
    stage: string;
    assignedTo:string;
    form:string;
    sortBy: string;
    sortOrder: "asc" | "desc";
    dateRange: {
        startDate: string | null;
        endDate: string | null;
    } | null;
    read: boolean | null;
    tags: string[];
};
const initialLeadQuery:TLeadQuery={
    limit:10,
    search:"",
    source:"",
    status:"",
    stage:"",
    assignedTo:"",
    form:"",
    sortBy:"",
    sortOrder:"desc",
    dateRange:{
        startDate:"",
        endDate:"",
    },
    read:null,
    tags:[],
}

export const useLeadsStore = create<ILeadsStoreState>((set,get)=>({
    leads:[],
    loadingLeads:false,

    currentPage:1,
    totalPages:1,
    totalItems:10,

    editingField: null,
    updatingLead: false,

    leadQuery:initialLeadQuery,
    setLeadQuery: (query) => {
        set((state) => ({
            leadQuery: {
                ...state.leadQuery,
                ...query,
            },
            currentPage: 1,
        }));
    },

    openSort: false,
    setEditingField: (field) => {
        set({
            editingField: field,
        });
    },
    setOpenSort: (openSort) => {
        set({openSort: openSort})
    },
    setCurrentPage: (page) => {
        const current =get().currentPage;

        if (current === page)
            return;

        set({currentPage: page,});
    },
    fetchLeads:async(accountId)=>{
        try {
            set({loadingLeads:true})

            const {leadQuery,currentPage}=get();
            const payload = {
                page:currentPage,
                limit:leadQuery.limit,
                search: leadQuery.search.trim() || undefined,
                filters:{
                    stage: leadQuery.stage||"",
                    status: leadQuery.status||"",
                    source: leadQuery.source||"",
                },
                
                assignedTo: leadQuery.assignedTo||"",
                form: leadQuery.form||"",
                dateRange: leadQuery.dateRange,
                read: leadQuery.read,
                sort:{
                    field: leadQuery.sortBy || undefined,
                    order: leadQuery.sortOrder,
                }
            };

            console.log(payload)
            const response = await leadService.getLeads(String(accountId), payload);

            const leads=response.data.docs;
            set({
                leads,
                totalPages:response.data?.pagination?.totalPages,
                totalItems: response.data.pagination?.totalDocs
            })
        } catch (error) {
            console.error("Fetch leads error", error);
        }finally{
            set({loadingLeads:false})
        }
    },
    updateLeadField: async (accountId,leadId,field,value) => {

        console.log("Updating lead", {leadId,field,value});
        const prevLeads =get().leads;

        try {
            set({updatingLead: true});

            // Optimistic update
            set((state) => ({
                leads: state.leads.map((lead) => {
                    if (lead.id !== leadId) {
                        return lead;
                    }

                    return {
                        ...lead,
                        [field]: value,
                    };
                }),
            }));

            // Partial payload only
            const payload = {
                id:leadId,
                [field]: value,
            };

            console.log("Api payload", payload)
            await leadService.updateLead(accountId, payload);

            set({editingField: null,});
        } catch (error) {
            console.error("Update lead failed",error);

            // rollback
            set({    leads: prevLeads,});
        } finally {
            set({updatingLead: false,});
        }
    },
    addLead: async (accountId, payload) => {
        await leadService.createLead(accountId, payload);
    }
}));

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
