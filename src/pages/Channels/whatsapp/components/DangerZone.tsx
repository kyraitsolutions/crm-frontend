import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeader } from "./SectionHeader";
import { AlertTriangle, CloudOff } from "lucide-react";

export const DangerZone = () => {
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

        <Button className="actions-btn py-2! px-4! bg-red-100! text-red-400! border-red-300! font-semibold!">
          <CloudOff /> Disconnect
        </Button>
      </CardContent>
    </Card>
  );
};
