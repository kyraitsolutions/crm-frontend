import { ApiService } from "@/services";
import type { ApiResponse } from "@/types";
import type { ICreateLead, ILead } from "../types/lead.type";

type LeadListPayload = {
  page: number;
  limit: number;
  search?: string;
  filters: {
    stage?: string;
    status?: string;
    source?: string;
  };
  assignedTo?: string;
  form?: string;
  dateRange?: {
    startDate: string | null;
    endDate: string | null;
  } | null;
  read?: boolean | null;
  sort: {
    field?: string;
    order: "asc" | "desc";
  };
};

export class LeadService extends ApiService {
  getLeads(
    accountId: string,
    payload: LeadListPayload,
  ): Promise<ApiResponse<any>> {
    return this.post(`/account/${accountId}/leads`, payload);
  }

  getLead(accountId: string, leadId: string): Promise<ApiResponse<ILead>> {
    return this.get(`/account/${accountId}/lead/${leadId}/details`);
  }

  createLead(
    accountId: string,
    payload: ICreateLead | ICreateLead[],
  ): Promise<ApiResponse<ILead>> {
    return this.post(`/account/${accountId}/lead`, payload);
  }
  createBulkLead(
    accountId: string,
    payload: ICreateLead | ICreateLead[],
  ): Promise<ApiResponse<ILead>> {
    return this.post(`/account/${accountId}/lead/bulk-write`, payload);
  }

  updateLead(
    accountId: string,
    lead: Partial<ILead> & { id: string },
  ): Promise<ApiResponse<ILead>> {
    return this.put(`/account/${accountId}/lead/${lead.id}/update`, lead);
  }

  getLeadSummary(accountId: string, leadId: string): Promise<ApiResponse<any>> {
    return this.get(`/account/${accountId}/lead/${leadId}/ai-summary`);
  }

  buildLeadPayload(
    csvRow: Record<string, string>,
    mapping: Record<string, string>,
  ): ICreateLead {
    const payload: ICreateLead = {};

    for (const [csvHeader, crmField] of Object.entries(mapping)) {
      if (!crmField) continue;

      const value = csvRow[csvHeader];

      if (!value || !String(value).trim()) continue;

      const trimmed = String(value).trim();

      if (crmField.startsWith("custom.")) {
        const key = crmField.replace("custom.", "");

        payload.customFields ??= {};
        payload.customFields[key] = trimmed;

        continue;
      }

      if (crmField.includes(".")) {
        const [parent, child] = crmField.split(".");

        (payload as any)[parent] ??= {};
        (payload as any)[parent][child] = trimmed;

        continue;
      }

      (payload as any)[crmField] = trimmed;
    }

    // ensure source.name is set properly instead of using an invalid dotted key
    (payload as any).source ??= {};
    (payload as any).source.name = "import";

    return payload;
  }

  async buildAllLeadPayloads(
    accountId: string,
    csvRows: Record<string, string>[],
    mapping: Record<string, string>,
  ) {
    const payloads = csvRows
      .map((row) => this.buildLeadPayload(row, mapping))
      .filter((payload) => Object.keys(payload).length > 0);
      console.log(payloads); 

    return payloads;    
      // return this.createLead(accountId, payloads);
  }
}

export const leadService = new LeadService();

// import { ApiService } from "@/services";
// import type { ApiResponse } from "@/types";
// import type { ICreateLead } from "../types/lead.type";

// export class LeadService extends ApiService {
//   async getLeads(
//     accountId: string,
//     payload: Record<string, any>,
//   ): Promise<ApiResponse<any>> {
//     return await this.post(`/account/${accountId}/leads`, payload);
//   }

//   async updateLead(accountId: string, lead: any): Promise<ApiResponse<any>> {
//     return await this.put(`account/${accountId}/lead/${lead.id}/update`, lead);
//   }
//   async getLead(accountId: string, leadId: string): Promise<ApiResponse<any>> {
//     return await this.get(`account/${accountId}/lead/${leadId}/details`);
//   }
//   async createLead(accountId: string, payload: any): Promise<ApiResponse<any>> {
//     return await this.post(`account/${accountId}/lead`, payload);
//   }

//   async getLeadSummary(
//     accountId: string,
//     leadId: string,
//   ): Promise<ApiResponse<any>> {
//     return await this.get(`account/${accountId}/lead/${leadId}/ai-summary`);
//   }

//   async buildLeadPayload(
//     csvRow: Record<string, any>,
//     mapping: Record<string, string>,
//   ): Promise<ICreateLead> {
//     const payload: ICreateLead = {};

//     for (const [csvHeader, crmField] of Object.entries(mapping)) {
//       if (!crmField) continue;

//       const value = csvRow[csvHeader];
//       if (value === undefined || value === null || String(value).trim() === "")
//         continue;

//       const trimmed = String(value).trim();

//       if (crmField.startsWith("custom.")) {
//         // custom.city → customFields: { city: "..." }
//         const key = crmField.replace("custom.", "");
//         if (!payload.customFields) payload.customFields = {};
//         payload.customFields[key] = trimmed;
//       } else if (crmField.includes(".")) {
//         // source.name → source: { name: "..." }
//         // source.url  → source: { url: "..." }
//         const [parent, child] = crmField.split(".");
//         if (!(payload as any)[parent]) (payload as any)[parent] = {};
//         (payload as any)[parent][child] = trimmed;
//       } else {
//         // flat standard field
//         (payload as any)[crmField] = trimmed;
//       }
//     }

//     return payload;
//   }

//   async buildAllLeadPayloads(
//     accountId: string,
//     csvRows: Record<string, any>[],
//     mapping: Record<string, string>,
//   ): Promise<ICreateLead[] | any> {
//     // buildLeadPayload is async so use Promise.all, not .map + filter directly
//     const payloads = await Promise.all(
//       csvRows.map((row) => this.buildLeadPayload(row, mapping)),
//     );

//     const data = payloads.filter((p) => Object.keys(p).length > 0);
//     const response = await this.createLead(accountId, data);
//     // console.log("Api Response",response.data)
//     return response.data;
//   }
// }

// export const leadService = new LeadService();
