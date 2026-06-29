import { Building2, Phone, Radio, ShieldCheck } from "lucide-react";
import { StatCard } from "./cards/StatCard";

interface Props {
  data: {
    phoneNumberInfo: {
      displayPhoneNumber: string;
      accountMode: string;
      isVerified?: boolean;
    };
    businessInfo: {
      name: string;
      isVerified?: boolean;
    };
    isConnected: boolean;
    qualityRating?: string; // e.g. "UNKNOWN"
  };
}

export function QuickStats({ data }: Props) {
  const mode = data.phoneNumberInfo.accountMode; // "LIVE" | "SANDBOX" etc.
  const quality = data.qualityRating ?? "UNKNOWN";

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {/* Phone Number */}
      <StatCard
        title="Phone Number"
        value={data.phoneNumberInfo.displayPhoneNumber}
        icon={Phone}
        iconBg="bg-violet-500/20"
        iconColor="text-violet-400"
        badge={
          data.phoneNumberInfo.isVerified !== false
            ? { label: "Verified", color: "bg-emerald-100 text-emerald-500" }
            : undefined
        }
      />

      {/* Business Name */}
      <StatCard
        title="Business Name"
        value={data.businessInfo.name}
        icon={Building2}
        iconBg="bg-blue-500/20"
        iconColor="text-blue-400"
        badge={
          data.businessInfo.isVerified !== false
            ? { label: "Verified", color: "bg-sky-100 text-sky-500" }
            : undefined
        }
      />

      {/* Account Mode */}
      <StatCard
        title="Account Mode"
        value={mode}
        icon={Radio}
        iconBg="bg-amber-500/20"
        iconColor="text-amber-400"
        badge={
          mode === "LIVE"
            ? { label: "Active", color: "bg-emerald-100 text-emerald-500" }
            : { label: "Inactive", color: "bg-slate-500/15 text-slate-400" }
        }
      />

      {/* Quality Rating */}
      <StatCard
        title="Quality Rating"
        value={quality}
        icon={ShieldCheck}
        iconBg="bg-emerald-500/20"
        iconColor="text-emerald-400"
        badge={
          quality === "UNKNOWN"
            ? {
              label: "Review Pending",
              color: "bg-yellow-100 text-yellow-600",
            }
            : quality === "GREEN"
              ? { label: "Good", color: "bg-green-500/15 text-green-400" }
              : { label: "At Risk", color: "bg-red-500/15 text-red-400" }
        }
      />
    </div>
  );
}

// interface Props {
//   data: any;
// }

// export function QuickStats({ data }: Props) {
//   return (
//     <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
//       <StatCard
//         title="Phone Number"
//         value={data.phoneNumberInfo.displayPhoneNumber}
//         icon={Phone}
//       />

//       <StatCard
//         title="Business"
//         value={data.businessInfo.name}
//         icon={Building2}
//       />

//       <StatCard
//         title="Mode"
//         value={data.phoneNumberInfo.accountMode}
//         icon={Radio}
//       />

//       <StatCard
//         title="Status"
//         value={data.isConnected ? "Connected" : "Disconnected"}
//         icon={CheckCircle}
//       />
//     </div>
//   );
// }
