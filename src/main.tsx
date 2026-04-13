import { SnackbarProvider } from "notistack";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AlertDialog } from "./components/common/AlertDialogPopup.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.Fragment>
    {/* <KyraProductCard /> */}

    <App />
    <SnackbarProvider />
    <AlertDialog />
  </React.Fragment>,
);
