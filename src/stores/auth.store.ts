import { COOKIES_STORAGE } from "@/constants";
import type { IUser } from "@/types";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { getLastSlugFromPath } from "@/utils/typography.utils";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IAuthStoreState {
  user: IUser | null;
  accountName: string | null;
  accountId?: string | null;
  lastSlug: string | null;
}

export const useAuthStore = create<IAuthStoreState>()(
  immer((_) => ({
    user: null,
    accountName: CookieUtils.getItem(COOKIES_STORAGE.accountName) || null,
    accountId: CookieUtils.getItem(COOKIES_STORAGE.accountId) || null,
    lastSlug: CookieUtils.getItem(COOKIES_STORAGE.lastSlug) || null,
  })),
);

export class AuthStoreManager {
  private store = useAuthStore;
  constructor() {
    this.store = useAuthStore;
  }

  setUser(user: IUser | null) {
    this.store.setState({ user });
  }

  setAccountName(accountName: string | null) {
    this.store.setState({ accountName });
    CookieUtils.setItem(COOKIES_STORAGE.accountName, accountName);
  }

  setAccountId(accountId: string | null) {
    this.store.setState({ accountId });
    CookieUtils.setItem(COOKIES_STORAGE.accountId, accountId);
  }

  setLastSlugPath(slug: string | null) {
    const lastSlug = getLastSlugFromPath(slug as string);
    this.store.setState({ lastSlug });

    CookieUtils.setItem(COOKIES_STORAGE.lastSlug, lastSlug);
  }
}
