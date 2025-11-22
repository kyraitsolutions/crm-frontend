import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: AlertType;
  autoClose: boolean;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
  openAlert: (payload: Partial<AlertState>) => void;
  closeAlert: () => void;
}

/**
 * ✅ Zustand store (with Immer)
 */
export const useAlertStore = create<AlertState>()(
  immer<AlertState>((set) => ({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    type: "info",
    autoClose: false,
    onConfirm: null,
    onCancel: null,

    openAlert: (payload) =>
      set((state) => {
        Object.assign(state, payload, { isOpen: true });
      }),

    closeAlert: () =>
      set((state) => {
        state.isOpen = false;
      }),
  }))
);

/**
 * ✅ Global helper for triggering alerts anywhere
 */
export const alertManager = {
  show: (options: Partial<AlertState>) => {
    const { openAlert } = useAlertStore.getState();
    openAlert(options);
  },
  close: () => {
    const { closeAlert } = useAlertStore.getState();
    closeAlert();
  },
};
