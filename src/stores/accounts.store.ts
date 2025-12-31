import type { IAccount } from "@/types/accounts.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IAccountsStoreState {
  accounts: IAccount[] | [];
  totalAccounts: number | null;
}

export const useAccountsStore = create<IAccountsStoreState>()(
  immer<IAccountsStoreState>(() => ({
    accounts: [],
    totalAccounts: null,
  }))
);

export class AccountsStoreManager {
  private store = useAccountsStore;

  constructor() {
    this.store = useAccountsStore;
  }

  setAccounts(accounts: IAccount[]) {
    this.store.setState(() => ({
      accounts: [...accounts],
      totalAccounts: accounts.length,
    }));
  }

  setAccountTop(account: IAccount) {
    this.store.setState((state) => ({
      accounts: [account, ...state.accounts],
      totalAccounts: (state.totalAccounts ?? 0) + 1,
    }));
  }

  updateAccount(updatedAccount: IAccount) {
    this.store.setState((state) => {
      const index = state.accounts.findIndex((a) => a.id === updatedAccount.id);

      if (index !== -1) {
        state.accounts[index] = updatedAccount;
      }
    });
  }

  /** Optimistic update + rollback */
  updateAccountOptimistic(updatedAccount: IAccount) {
    const prevAccounts = this.store.getState().accounts;

    // optimistic update
    this.updateAccount(updatedAccount);

    // rollback
    return () => {
      this.store.setState(() => ({
        accounts: prevAccounts,
      }));
    };
  }

  deleteAccount(accountId: string) {
    this.store.setState((state) => ({
      accounts: state.accounts.filter((account) => account.id !== accountId),
      totalAccounts: (state.totalAccounts ?? 1) - 1,
    }));
  }

  /** Optimistic delete + rollback */
  deleteAccountOptimistic(accountId: string) {
    const prevAccounts = this.store.getState().accounts;
    const prevTotal = this.store.getState().totalAccounts;

    // optimistic delete
    this.deleteAccount(accountId);

    // rollback
    return () => {
      this.store.setState(() => ({
        accounts: prevAccounts,
        totalAccounts: prevTotal,
      }));
    };
  }
}
