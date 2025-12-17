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
}
