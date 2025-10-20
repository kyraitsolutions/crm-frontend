import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";
import type { createUserprofile } from "@/types/userprofile.type";

export class UserprofileService extends ApiService {
  async createUserProfile(data: createUserprofile): Promise<ApiResponse<any>> {
    return await this.post("/user/profile", data);
  }
}
