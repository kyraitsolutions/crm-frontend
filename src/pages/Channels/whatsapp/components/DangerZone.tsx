import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeader } from "./SectionHeader";
import { AlertTriangle, CloudOff } from "lucide-react";
import { ToastMessageService } from "@/services";
import { useWhatsAppStore } from "../store/whatsapp.store";
import { useAuthStore } from "@/stores";
import { useIntegrationStore } from "@/stores/integration.store";
import type { ApiError } from "@/types";
import { useState } from "react";
import Loader from "@/components/Loader";

export const DangerZone = () => {
  const [loadingDisconnect, setLoadingDisconnect] = useState(false);
  const accountId = useAuthStore((state) => state.accountId);
  const { integration, getIntegration } = useIntegrationStore((state) => state);
  const { disconnect } = useWhatsAppStore((state) => state);
  const toastService = new ToastMessageService();

  const handleDisconnect = async () => {
    setLoadingDisconnect(true);
    try {
      await disconnect(String(accountId), String(integration?.id));
      getIntegration("whatsapp", String(accountId));
    } catch (error) {
      const err = error as ApiError;
      if (err) {
        toastService.error(err.message || "Failed to disconnect");
      }
    } finally {
      setLoadingDisconnect(false);
    }
  };

  return (
    <Card className="border">
      <CardHeader>
        <SectionHeader
          icon={AlertTriangle}
          iconBg="bg-red-100"
          iconColor="text-red-500"
          title="Danger Zone"
          description="Actions here may affect message delivery."
        />
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <div>
          <p className="font-medium">Disconnect WhatsApp</p>
          <p className="text-sm text-muted-foreground">
            Stop sending and receiving messages through this integration.
          </p>
        </div>

        <Button
          disabled={loadingDisconnect}
          onClick={handleDisconnect}
          className="actions-btn py-2! px-4! bg-red-100! text-red-400! border-red-300! font-semibold!"
        >
          <CloudOff />{" "}
          {loadingDisconnect ? (
            <>
              Disconnect <Loader className="border-primary/80" />
            </>
          ) : (
            "Disconnect"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
