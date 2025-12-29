import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";

export class LeadFormService extends ApiService {
  constructor() {
    super();
  }

  async getLeadFromsList(accountId: string): Promise<ApiResponse<any | null>> {
    return await this.get(`/account/${accountId}/forms`);
  }

  async deleteFormById(
    accountId: string,
    formId: string
  ): Promise<ApiResponse<any | null>> {
    return await this.delete(`/account/${accountId}/form/${formId}`);
  }
}
