import { COOKIES_STORAGE } from "@/constants";
import type { IUser } from "@/types";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IAuthStoreState {
  user: IUser | null;
  accountSelected: boolean;
}

export const useAuthStore = create<IAuthStoreState>()(
  immer((_) => ({
    user: null,
    accountSelected:
      CookieUtils.getItem(COOKIES_STORAGE.accountSelected) || false,
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

  setAccountSelected(accountSelected: boolean) {
    this.store.setState({ accountSelected });
    CookieUtils.setItem(COOKIES_STORAGE.accountSelected, accountSelected);
  }
}
