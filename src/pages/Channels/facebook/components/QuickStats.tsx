import { Building2, CheckCircle, Instagram, LayoutGrid } from "lucide-react";
import { StatCard } from "@/pages/Channels/whatsapp/components/cards/StatCard";
import type { TMetaAccount } from "../types/meta.type";

interface Props {
  data: TMetaAccount;
}

export function QuickStats({ data }: Props) {
  const page = data?.facebookPage;
  const instagram = data?.instagram;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Facebook Page"
        value={page?.name || "—"}
        icon={Building2}
        iconBg="bg-blue-500/20"
        iconColor="text-blue-400"
        badge={{ label: "Connected", color: "bg-blue-100 text-blue-600" }}
      />

      <StatCard
        title="Category"
        value={page?.category || "—"}
        icon={LayoutGrid}
        iconBg="bg-violet-500/20"
        iconColor="text-violet-400"
      />

      <StatCard
        title="Instagram"
        value={instagram?.username ? `@${instagram.username}` : "Not linked"}
        icon={Instagram}
        iconBg="bg-pink-500/20"
        iconColor="text-pink-400"
        badge={
          instagram?.id
            ? { label: "Linked", color: "bg-pink-100 text-pink-600" }
            : { label: "Missing", color: "bg-slate-100 text-slate-500" }
        }
      />

      <StatCard
        title="Status"
        value={data?.isConnected ? "Connected" : "Disconnected"}
        icon={CheckCircle}
        iconBg="bg-emerald-500/20"
        iconColor="text-emerald-400"
        badge={
          data?.isConnected
            ? { label: "Active", color: "bg-emerald-100 text-emerald-500" }
            : { label: "Inactive", color: "bg-slate-500/15 text-slate-400" }
        }
      />
    </div>
  );
}
