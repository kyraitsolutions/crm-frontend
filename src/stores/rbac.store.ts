import type { TRole } from "@/pages/UsersAndControl/role.page";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IRolesStoreState {
  roles: TRole[];
  totalRoles: number | null;
}

export const useRolesStore = create<IRolesStoreState>()(
  immer<IRolesStoreState>(() => ({
    roles: [],
    totalRoles: null,
  })),
);

export class RolesStoreManager {
  private store = useRolesStore;

  constructor() {
    this.store = useRolesStore;
  }

  setRoles(roles: TRole[]) {
    this.store.setState(() => ({
      roles: [...roles],
      totalRoles: roles.length,
    }));
  }

  setRoleTop(role: TRole) {
    this.store.setState((state) => ({
      roles: [role, ...state.roles],
      totalRoles: (state.totalRoles ?? 0) + 1,
    }));
  }

  updateRole(updatedRole: TRole) {
    this.store.setState((state) => {
      const index = state.roles.findIndex((r) => r.id === updatedRole.id);

      if (index !== -1) {
        state.roles[index] = updatedRole;
      }
    });
  }
  /** Optimistic update + rollback */
  updateRoleOptimistic(updatedRole: TRole) {
    const prevRoles = this.store.getState().roles;

    // optimistic update
    this.updateRole(updatedRole);

    // rollback
    return () => {
      this.store.setState(() => ({
        roles: prevRoles,
      }));
    };
  }

  deleteRole(roleId: string) {
    this.store.setState((state) => ({
      roles: state.roles.filter((role) => role.id !== roleId),
      totalRoles: (state.totalRoles ?? 1) - 1,
    }));
  }
  /** Optimistic delete + rollback */
  deleteRoleOptimistic(roleId: string) {
    const prevRoles = this.store.getState().roles;
    const prevTotal = this.store.getState().totalRoles;

    // optimistic delete
    this.deleteRole(roleId);

    // rollback
    return () => {
      this.store.setState(() => ({
        roles: prevRoles,
        totalRoles: prevTotal,
      }));
    };
  }
}
