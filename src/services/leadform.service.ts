import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";

export class LeadFormService extends ApiService {
  constructor() {
    super();
  }

  async createLeadForm(
    accountId: string,
    form: any,
  ): Promise<ApiResponse<any | null>> {
    return await this.post(`/account/${accountId}/form`, form);
  }

  async getLeadFromsList(accountId: string): Promise<ApiResponse<any | null>> {
    return await this.get(`/account/${accountId}/forms`);
  }

  async getLeadFormById(
    accountId: string,
    formId: string,
  ): Promise<ApiResponse<any | null>> {
    return await this.get(`/account/${accountId}/form/${formId}`);
  }

  async updateLeadFormById(
    accountId: string,
    formId: string,
    form: any,
  ): Promise<ApiResponse<any | null>> {
    return await this.put(`/account/${accountId}/form/${formId}`, form);
  }

  async deleteFormById(
    accountId: string,
    formId: string,
  ): Promise<ApiResponse<any | null>> {
    return await this.delete(`/account/${accountId}/form/${formId}`);
  }
}
