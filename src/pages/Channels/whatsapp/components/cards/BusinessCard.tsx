// BusinessCard.tsx
import { Building2, ClockIcon, Hash, MessageCircleIcon } from "lucide-react";
import { InfoRow } from "../InfoRow";
import { GlassCard } from "./GlassCard";

interface BusinessCardProps {
  data: {
    businessInfo: {
      id: string;
      name: string;
    };
    wabaInfo: {
      id: string;
      name: string;
      timezone: string;
      marketingMessagesStatus: string;
    };
  };
}

export const BusinessCard = ({ data }: BusinessCardProps) => {
  return (
    <GlassCard className="p-5 space-y-4">
      {/* ── Section 1: Business Information ── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Business Information
          </h3>
        </div>

        <div className="divide-y divide-primary/10">
          <InfoRow
            icon={Hash}
            label="Business ID"
            value={data.businessInfo.id}
          />
          <InfoRow
            icon={Building2}
            label="Business Name"
            value={data.businessInfo.name}
          />
        </div>
      </div>

      {/* ── Section 2: WhatsApp Business Account ── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            WhatsApp Business Account
          </h3>
        </div>

        <div className="divide-y divide-primary/10">
          <InfoRow icon={Hash} label="WABA ID" value={data.wabaInfo.id} />
          <InfoRow
            icon={Building2}
            label="WABA Name"
            value={data.wabaInfo.name}
          />
          <InfoRow
            icon={ClockIcon}
            label="Timezone"
            value={data.wabaInfo.timezone}
          />
          <InfoRow
            icon={MessageCircleIcon}
            label="Marketing Messages Status"
            value={data.wabaInfo.marketingMessagesStatus}
          />
        </div>
      </div>
    </GlassCard>
  );
};
