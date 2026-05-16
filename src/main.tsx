import { SnackbarProvider } from "notistack";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AlertDialog } from "./components/common/AlertDialogPopup.tsx";
import "./index.css";
import NotificationProvider from "./providers/NotificationProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <React.Fragment>
    {/* <KyraProductCard /> */}

    <NotificationProvider>
      <App />
    </NotificationProvider>
    <SnackbarProvider />
    <AlertDialog />
  </React.Fragment>,
);
