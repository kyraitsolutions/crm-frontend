import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SnackbarProvider } from "notistack";
import { AlertDialog } from "./components/common/AlertDialogPopup.tsx";
import KyraProductCard from "./components/popup/KyraProductHuntCard.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <SnackbarProvider />
    <AlertDialog />
    <KyraProductCard />
  </StrictMode>
);
