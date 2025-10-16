import type { IUser } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IAuthStoreState {
  user: IUser | null;
}

export const useAuthStore = create<IAuthStoreState>()(
  immer((_) => ({
    user: null,
  }))
);

export class AuthStoreManager {
  private store = useAuthStore;
  constructor() {
    this.store = useAuthStore;
  }

  setUser(user: IUser | null) {
    this.store.setState({ user });
  }
}
