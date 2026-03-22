import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";
import type { createUserprofile } from "@/types/userprofile.type";
import { API_ENDPOINT_PATH } from "@/constants/api's-path";

export class UserService extends ApiService {
  async createOnboarding(data: createUserprofile): Promise<ApiResponse<any>> {
    return await this.post(`${API_ENDPOINT_PATH?.USER?.ONBOARDING}`, data);
  }
}
