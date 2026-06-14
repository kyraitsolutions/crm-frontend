import { ClipboardCheck, Link, Verified } from "lucide-react";
import { StatusRow } from "../StatusRow";
import { GlassCard } from "./GlassCard";

interface ConnectionStatusProps {
  connected: boolean;
  onboardingCompleted: boolean;
  webhookSubscribed: boolean;
  officialBusiness: boolean;
}

export const ConnectionStatusCard = ({
  connected,
  onboardingCompleted,
  officialBusiness,
}: ConnectionStatusProps) => {
  return (
    <GlassCard className="p-5">
      <h3 className="mb-8 text-sm font-semibold uppercase tracking-widest text-slate-500">
        Connection Status
      </h3>

      <div className="space-y-8">
        <StatusRow
          icon={Link}
          iconBg="bg-green-500/15"
          iconColor="text-green-400"
          label="Connected"
          subtitle="WhatsApp Business Platform"
          value={connected}
        />

        <StatusRow
          icon={ClipboardCheck}
          iconBg="bg-green-500/15"
          iconColor="text-green-400"
          label="Onboarding Completed"
          subtitle="Business setup completed"
          value={onboardingCompleted}
        />

        {/* <StatusRow
          icon={Webhook}
          iconBg={webhookSubscribed ? "bg-green-500/15" : "bg-red-500/15"}
          iconColor={webhookSubscribed ? "text-green-400" : "text-red-400"}
          label="Webhook Subscribed"
          subtitle="Real-time event notifications"
          value={webhookSubscribed}
        /> */}

        <StatusRow
          icon={Verified}
          iconBg={officialBusiness ? "bg-green-500/15" : "bg-red-500/15"}
          iconColor={officialBusiness ? "text-green-400" : "text-red-400"}
          label="Official Business Account"
          subtitle="Verified business account"
          value={officialBusiness}
        />
      </div>
    </GlassCard>
  );
};
