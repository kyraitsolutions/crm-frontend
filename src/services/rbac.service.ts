import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "./api.service";

export class RBACService extends ApiService {
  async createRole(data: { roleName: string; permissions: string[] }) {
    return await this.post(`${API_ENDPOINT_PATH.ROLES.CREATE_ROLE}`, data);
  }
  async getRoles(): Promise<any> {
    return await this.get(`${API_ENDPOINT_PATH.ROLES.GET_ROLES}`);
  }

  async updateRole(roleId: string, data: any) {
    return await this.put(
      `${API_ENDPOINT_PATH.ROLES.updateRolePath(roleId)}`,
      data,
    );
  }
  async deleteRole(roleId: string) {
    return await this.delete(
      `${API_ENDPOINT_PATH.ROLES.deleteRolePath(roleId)}`,
    );
  }

  async getPermissionsByRole(roleId: string) {
    return await this.get(
      `${API_ENDPOINT_PATH.ROLES.getPermissionsByRolePath(roleId)}`,
    );
  }
}
