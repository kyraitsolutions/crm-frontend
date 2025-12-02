import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";

export class TeamService extends ApiService {
  async getTeamMembers(): Promise<ApiResponse<any>> {
    return await this.get("/team");
  }

  async createTeamMember(teamMember: any): Promise<ApiResponse<any>> {
    return await this.post("/team", teamMember);
  }

  async deleteTeamMember(teamMemberId:string):Promise<ApiResponse<any>>{
    return await this.delete(`/team/${teamMemberId}`)
  }


  async assignAccountToTeamMember(data: {
    id: string;
    accountIds: string[];
    leadId: string;
  }): Promise<ApiResponse<any>> {
    return await this.post(`/team/${data.id}/assign-account`, {
      accountIds: data.accountIds,
      leadId: data.leadId,
    });
  }
}