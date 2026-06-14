import { ApiService } from "@/services";
import type { ApiResponse } from "@/types";
import type { ICreateLead } from "../types/lead.type";

export class LeadService extends ApiService {
  async getLeads(accountId: string, payload: Record<string, any>): Promise<ApiResponse<any>> {
    return await this.post(`/account/${accountId}/leads`, payload);
  }

  async updateLead(accountId: string, lead: any): Promise<ApiResponse<any>> {
    return await this.put(`account/${accountId}/lead/${lead.id}/update`, lead);
  }
  async getLead(accountId: string, leadId: string): Promise<ApiResponse<any>> {
    return await this.get(`account/${accountId}/lead/${leadId}/details`);
  }
  async createLead(accountId: string, payload: any): Promise<ApiResponse<any>> {
    return await this.post(`account/${accountId}/lead`, payload);
  }

  async getLeadSummary(accountId: string, leadId: string): Promise<ApiResponse<any>> {
    console.log("jhjghfg", leadId)
    return await this.get(`account/${accountId}/lead/${leadId}/ai-summary`)
  }

  async buildLeadPayload(csvRow: Record<string, any>, mapping: Record<string, string>): Promise<ICreateLead> {
    const payload: ICreateLead = {};

    for (const [csvHeader, crmField] of Object.entries(mapping)) {
      if (!crmField) continue;

      const value = csvRow[csvHeader];
      if (value === undefined || value === null || String(value).trim() === "") continue;

      const trimmed = String(value).trim();

      if (crmField.startsWith("custom.")) {
        // custom.city → customFields: { city: "..." }
        const key = crmField.replace("custom.", "");
        if (!payload.customFields) payload.customFields = {};
        payload.customFields[key] = trimmed;

      } else if (crmField.includes(".")) {
        // source.name → source: { name: "..." }
        // source.url  → source: { url: "..." }
        const [parent, child] = crmField.split(".");
        if (!(payload as any)[parent]) (payload as any)[parent] = {};
        (payload as any)[parent][child] = trimmed;

      } else {
        // flat standard field
        (payload as any)[crmField] = trimmed;
      }
    }

    return payload;
  }

  async buildAllLeadPayloads(accountId:string,csvRows: Record<string, any>[],mapping: Record<string, string>): Promise<ICreateLead[]> {
    // buildLeadPayload is async so use Promise.all, not .map + filter directly
    const payloads = await Promise.all(
      csvRows.map((row) => this.buildLeadPayload(row, mapping))
    );

    const data= payloads.filter((p) => Object.keys(p).length > 0);
    const response= await this.createLead(accountId,data);
    // console.log("Api Response",response.data)
    return response.data
  }

}

export const leadService = new LeadService()
