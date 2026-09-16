import { AtSign, ExternalLink, Hash, LayoutGrid, Type } from "lucide-react";
import { GlassCard } from "@/pages/Channels/whatsapp/components/cards/GlassCard";
import { InfoRow } from "@/pages/Channels/whatsapp/components/InfoRow";
import type { TFacebookPage } from "../../types/meta.type";

interface FacebookPageCardProps {
  data?: TFacebookPage | null;
}

export function FacebookPageCard({ data }: FacebookPageCardProps) {
  if (!data) return null;

  return (
    <GlassCard className="p-5 rounded-2xl">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          Facebook Page
        </h3>
      </div>

      {data.picture ? (
        <div className="mb-4 flex items-center gap-3">
          <img
            src={data.picture}
            alt={data.name}
            className="size-12 rounded-full object-cover ring-1 ring-slate-200"
          />
          <div>
            <p className="text-sm font-semibold text-gray-700">{data.name}</p>
            <p className="text-xs text-slate-400">{data.category || "Page"}</p>
          </div>
        </div>
      ) : null}

      <div className="divide-y divide-primary/10">
        <InfoRow icon={Hash} label="Page ID" value={data.id} />
        <InfoRow icon={Type} label="Page Name" value={data.name} />
        <InfoRow icon={AtSign} label="Username" value={data.username || "—"} />
        <InfoRow
          icon={LayoutGrid}
          label="Category"
          value={data.category || "—"}
        />
        <InfoRow icon={ExternalLink} label="Link" value={data.link || "—"} />
      </div>
    </GlassCard>
  );
}
