import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";
import type { ITeam } from "@/types/teams.type";

export class TeamService extends ApiService {
  async getTeamMembers(): Promise<ApiResponse<any>> {
    return await this.get("/team");
  }

  async createTeamMember(teamMember: ITeam): Promise<ApiResponse<any>> {
    return await this.post("/team", teamMember);
  }

  async updateTeamMember(teamMember: ITeam): Promise<ApiResponse<any>> {
    return await this.put(`/team/${teamMember.userId}`, teamMember);
  }

  async deleteTeamMember(teamMembersIds: string[]): Promise<ApiResponse<any>> {
    return await this.delete(`/team`, {
      teamMembersIds,
    });
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
