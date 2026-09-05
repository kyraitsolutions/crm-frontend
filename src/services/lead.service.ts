import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";

export class LeadService extends ApiService {
  async getLeads(
    accountId: string,
    payload: Record<string, any> = {},
  ): Promise<ApiResponse<any>> {
    const requestBody =
      payload.filters && payload.sort
        ? payload
        : {
            page: Number(payload.page) || 1,
            limit: Number(payload.limit) || 10,
            search: payload.q || payload.search,
            filters: {
              stage: payload.stage,
              status: payload.status,
              source: payload["source.name"] || payload.source,
            },
            assignedTo: payload.assignedTo,
            form: payload.form,
            dateRange: payload.dateRange,
            read: payload.read,
            sort: {
              field: payload.sortBy || payload.sortField,
              order: payload.sortOrder || "desc",
            },
          };

    return this.post(`/account/${accountId}/leads`, requestBody);
  }

  async getLead(accountId: string, leadId: string): Promise<ApiResponse<any>> {
    return this.get(`/account/${accountId}/lead/${leadId}/details`);
  }

  async createLead(accountId: string, payload: unknown): Promise<ApiResponse<any>> {
    return this.post(`/account/${accountId}/lead`, payload);
  }

  async updateLead(accountId: string, lead: any): Promise<ApiResponse<any>> {
    const leadId = lead.id || lead._id;
    return this.put(`/account/${accountId}/lead/${leadId}/update`, lead);
  }

  async getLeadSummary(
    accountId: string,
    leadId: string,
  ): Promise<ApiResponse<any>> {
    return this.get(`/account/${accountId}/lead/${leadId}/ai-summary`, undefined, {
      timeout: 60000,
    });
  }
}
