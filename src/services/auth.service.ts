import type { ApiResponse, IUser } from "@/types";
import { ApiService } from "./api.service";

export class AuthService extends ApiService {
  async getProfile(): Promise<ApiResponse<IUser>> {
    return await this.get("/auth/profile");
  }
}
