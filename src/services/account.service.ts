import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";

interface CreateAccountPayload {
  accountName: string;
  email: string;
}

export class AccountService extends ApiService {
  async createAccount(data: CreateAccountPayload): Promise<ApiResponse<any>> {
    return await this.post("/account", data);
  }

  async getAccounts(): Promise<ApiResponse<any>> {
    return await this.get("/account");
  }

  async deleteAccount(id: string): Promise<ApiResponse<any>> {
    return await this.delete(`/account/${id}`);
  }
}
