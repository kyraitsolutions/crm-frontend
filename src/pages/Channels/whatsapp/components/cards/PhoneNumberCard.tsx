import { BadgeCheck, Hash, Layers, Phone, Star, Tag } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { InfoRow } from "../InfoRow";

interface PhoneNumberCardProps {
  data: {
    id: string;
    displayPhoneNumber: string;
    verifiedName: string;
    qualityRating: string;
    messagingLimitTier: string;
    nameStatus: string;
  };
}

export function PhoneNumberCard({ data }: PhoneNumberCardProps) {
  return (
    <GlassCard className="p-5">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          Phone Number Details
        </h3>
      </div>

      <div className="divide-y divide-primary/10">
        <InfoRow icon={Hash} label="Phone Number ID" value={data.id} />
        <InfoRow
          icon={Phone}
          label="Display Number"
          value={data.displayPhoneNumber}
        />
        <InfoRow
          icon={BadgeCheck}
          label="Verified Name"
          value={data.verifiedName}
        />
        <InfoRow icon={Star} label="Quality" value={data.qualityRating} />
        <InfoRow
          icon={Layers}
          label="Messaging Tier"
          value={data.messagingLimitTier}
        />
        <InfoRow icon={Tag} label="Name Status" value={data.nameStatus} />
      </div>
    </GlassCard>
  );
}
