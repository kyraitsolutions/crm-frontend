import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import type { ApiResponse, OnboardingFormData } from "@/types";
import { ApiService } from "./api.service";

export class OrganizationService extends ApiService {
  async createOnboarding(data: OnboardingFormData): Promise<ApiResponse<any>> {
    return await this.get(
      `${API_ENDPOINT_PATH?.ORGANIZATION?.ONBOARDING}`,
      data,
    );
  }

  async getOrganizationDetailsByOrganizationId(id: string) {
    return await this.get(
      `${API_ENDPOINT_PATH?.ORGANIZATION?.getOrganizationDetailsByOrganizationIdPath(id)}`,
    );
  }
}
