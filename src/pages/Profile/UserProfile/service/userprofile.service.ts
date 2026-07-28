import { ApiService } from "@/services";
import type { ApiResponse } from "@/types";
import type { createUserprofile } from "@/types/userprofile.type";
import type { UpdateUserProfile } from "../types/profile.type";

export class UserprofileService extends ApiService {
  async createUserProfile(data: createUserprofile): Promise<ApiResponse<any>> {
    return await this.post("/user/profile", data);
  }


  // update user type
  async updateUserProfile(data: UpdateUserProfile): Promise<ApiResponse<any>> {
    console.log("Profile data in service ",data)
    return await this.post("/user/profile/update", data);
  }

  async getUserProfileById(): Promise<ApiResponse<any>> {
    return await this.get("/user/profile");
  }
}

export const userProfileService=new UserprofileService();
