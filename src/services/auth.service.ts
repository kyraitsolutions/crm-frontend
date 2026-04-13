import type { ApiResponse, IUser } from "@/types";
import { ApiService } from "./api.service";
import { API_ENDPOINT_PATH } from "@/constants/api's-path";

export class AuthService extends ApiService {
  async getProfile(): Promise<ApiResponse<IUser>> {
    return await this.get("/auth/profile");
  }

  async getMe(): Promise<ApiResponse<IUser>> {
    return await this.get(
      `${API_ENDPOINT_PATH.AUTH_USER.ME}?includes=organization,permissions`,
    );
  }
}
