import { enqueueSnackbar } from "notistack";

type ToastType = "success" | "error" | "warning" | "info";

class ToastMessageService {
  showToast(type: ToastType, message: string) {
    enqueueSnackbar(message, {
      variant: type,
      anchorOrigin: { vertical: "bottom", horizontal: "right" },
    });
  }
  success(message: string) {
    this.showToast("success", message);
  }

  error(message: string) {
    this.showToast("error", message);
  }

  warning(message: string) {
    this.showToast("warning", message);
  }

  info(message: string) {
    this.showToast("info", message);
  }

  apiSuccess(message: string = "Your request was processed successfully") {
    this.success(message);
  }

  apiError(
    message: string = "An error occurred while processing your request"
  ) {
    this.error(message);
  }
}

export { ToastMessageService };
