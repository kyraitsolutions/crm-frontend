import { ClipboardCheck, Link, Webhook } from "lucide-react";
import { StatusRow } from "@/pages/Channels/whatsapp/components/StatusRow";
import { GlassCard } from "@/pages/Channels/whatsapp/components/cards/GlassCard";

interface ConnectionStatusProps {
  connected: boolean;
  onboardingCompleted: boolean;
  webhookSubscribed: boolean;
}

export const ConnectionStatusCard = ({
  connected,
  onboardingCompleted,
  webhookSubscribed,
}: ConnectionStatusProps) => {
  return (
    <GlassCard className="p-5 rounded-2xl">
      <h3 className="mb-8 text-sm font-semibold uppercase tracking-widest text-slate-500">
        Connection Status
      </h3>

      <div className="space-y-8">
        <StatusRow
          icon={Link}
          iconBg="bg-blue-500/15"
          iconColor="text-blue-400"
          label="Connected"
          subtitle="Facebook Page integration"
          value={connected}
        />

        <StatusRow
          icon={ClipboardCheck}
          iconBg="bg-blue-500/15"
          iconColor="text-blue-400"
          label="Onboarding Completed"
          subtitle="Page setup completed"
          value={onboardingCompleted}
        />

        <StatusRow
          icon={Webhook}
          iconBg={webhookSubscribed ? "bg-green-500/15" : "bg-red-500/15"}
          iconColor={webhookSubscribed ? "text-green-400" : "text-red-400"}
          label="Lead Ads Webhook"
          subtitle="Real-time lead notifications"
          value={webhookSubscribed}
        />
      </div>
    </GlassCard>
  );
};
