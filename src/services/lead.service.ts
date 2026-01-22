import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";

export class LeadService extends ApiService {
  async getLeads(
    accountId: string,
    params: Record<string, any>
  ): Promise<ApiResponse<any>> {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, val]) => {
        if (val !== undefined && val !== null) {
          acc[key] = String(val);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    return await this.get(`/account/${accountId}/leads?${queryString}`);
  }

  async updateLead(accountId: string, lead: any): Promise<ApiResponse<any>> {
    return await this.put(`account/${accountId}/lead/${lead._id}/update`, lead);
  }

  async getLeadSummary(accountId: string, leadId: string): Promise<ApiResponse<any>> {
    console.log("jhjghfg", leadId)
    return await this.get(`account/${accountId}/lead/${leadId}/ai-summary`)
  }
}
