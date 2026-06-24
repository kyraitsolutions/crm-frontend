// import { InfoRow } from "../InfoRow";
import { GlassCard } from "./GlassCard";

export function WabaCard({ data }: any) {
  console.log(data);
  return (
    <GlassCard className="p-6">
      <h3 className="mb-5 text-lg font-semibold">WhatsApp Business Account</h3>

      {/* <InfoRow label="WABA ID" value={data.id} /> */}

      {/* <InfoRow label="Name" value={data.name} /> */}

      {/* <InfoRow label="Timezone" value={data.timezone} /> */}

      {/* <InfoRow
        label="Marketing Status"
        value={data.marketingMessagesOnboardingStatus}
      /> */}
    </GlassCard>
  );
}
