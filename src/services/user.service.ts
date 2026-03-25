import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import type { ApiResponse, OnboardingFormData } from "@/types";
import { ApiService } from "./api.service";

export class UserService extends ApiService {
  async createOnboarding(data: OnboardingFormData): Promise<ApiResponse<any>> {
    return await this.post(
      `${API_ENDPOINT_PATH?.ORGANIZATION?.ONBOARDING}`,
      data,
    );
  }
}
