import { create } from "zustand";

interface IAccountAccessState {
  accountId: string | null;
  role: string | null;
  permissions: string[];
}

export const useAccountAccessStore = create<IAccountAccessState>(() => ({
  accountId: null,
  role: null,
  permissions: [],
}));

export class AccountAccessManager {
  private store = useAccountAccessStore;

  setAccess(data: { accountId: string; role: string; permissions: string[] }) {
    this.store.setState(() => data);
  }

  clear() {
    this.store.setState(() => ({
      accountId: null,
      role: null,
      permissions: [],
    }));
  }
}
