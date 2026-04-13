import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";
import type { IAccount } from "@/types/accounts.type";
import { API_ENDPOINT_PATH } from "@/constants/api's-path";

interface CreateAccountPayload {
  accountName: string;
  email: string;
}

export class AccountService extends ApiService {
  async createAccount(data: CreateAccountPayload): Promise<ApiResponse<any>> {
    return await this.post(API_ENDPOINT_PATH?.ACCOUNTS?.CREATE_ACCOUNT, data);
  }

  async getAccounts(): Promise<ApiResponse<IAccount>> {
    return await this.get(API_ENDPOINT_PATH?.ACCOUNTS?.GET_ACCOUNTS);
  }

  async getAccountById(id: string): Promise<ApiResponse<IAccount>> {
    return await this.get(API_ENDPOINT_PATH?.ACCOUNTS?.getAccountByIdPath(id));
  }

  async getAccountAccess(id: string): Promise<ApiResponse<any>> {
    return await this.get(
      API_ENDPOINT_PATH?.ACCOUNTS?.getAccountAccessPath(id),
    );
  }

  async deleteAccount(id: string): Promise<ApiResponse<any>> {
    return await this.delete(`/account/${id}`);
  }
}
