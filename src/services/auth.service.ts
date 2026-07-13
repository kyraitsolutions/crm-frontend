import type { ApiResponse, ILoginResponse, IUser } from "@/types";
import { ApiService } from "./api.service";
import { API_ENDPOINT_PATH } from "@/constants/api's-path";

export class AuthService extends ApiService {
  async getProfile(): Promise<ApiResponse<IUser>> {
    return await this.get("/auth/profile");
  }

  async getMe(): Promise<ApiResponse<IUser>> {
    console.log("called")
    return await this.get(
      `${API_ENDPOINT_PATH.AUTH_USER.ME}?includes=organization,permissions`,
    );
  }
  async register(userData: any): Promise<ApiResponse<ILoginResponse>> {
    // console.log("called")
    return await this.post(
      `${API_ENDPOINT_PATH.AUTH_USER.REGISTER}`,
      userData
    );
  }
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<ILoginResponse>> {
    return await this.post(
      `${API_ENDPOINT_PATH.AUTH_USER.LOGIN}`,
      credentials
    );
  }

  async forgotPassword(userData: any): Promise<ApiResponse<ILoginResponse>> {
    // console.log("called")
    return await this.post(
      `${API_ENDPOINT_PATH.AUTH_USER.FORGOT}`,
      userData
    );
  }
  async verifyOTP(userData: any): Promise<ApiResponse<any>> {
    console.log("called",userData)
    return await this.post(
      `${API_ENDPOINT_PATH.AUTH_USER.VERIFYOTP}`,
      userData
    );
  }
  async resetPassword(userData: any): Promise<ApiResponse<any>> {
    console.log("called",userData)
    return await this.post(
      `${API_ENDPOINT_PATH.AUTH_USER.RESET}`,
      userData
    );
  }
}
