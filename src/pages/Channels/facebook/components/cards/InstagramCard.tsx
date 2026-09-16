import { AtSign, Hash, Link2Off, Store, User } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { GlassCard } from "@/pages/Channels/whatsapp/components/cards/GlassCard";
import { InfoRow } from "@/pages/Channels/whatsapp/components/InfoRow";
import type { TInstagramAccount } from "../../types/meta.type";

interface InstagramCardProps {
  data?: TInstagramAccount;
}

export function InstagramCard({ data }: InstagramCardProps) {
  const isLinked = Boolean(data?.id);

  return (
    <GlassCard className="flex h-full flex-col p-5 rounded-2xl">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          Instagram Account
        </h3>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            isLinked
              ? "bg-pink-100 text-pink-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {isLinked ? "Linked" : "Not linked"}
        </span>
      </div>

      {isLinked ? (
        <div>
          <div className="mb-4 flex items-center gap-3">
            {data?.profilePictureUrl ? (
              <img
                src={data.profilePictureUrl}
                alt={data.username || data.name || "Instagram"}
                className="size-12 rounded-full object-cover ring-2 ring-pink-200"
              />
            ) : (
              <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white">
                <FaInstagram size={22} />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {data?.name || data?.username}
              </p>
              <p className="text-xs text-slate-400">
                {data?.username ? `@${data.username}` : "Instagram"}
              </p>
            </div>
          </div>

          <div className="divide-y divide-primary/10">
            <InfoRow icon={Hash} label="Instagram ID" value={data?.id || "—"} />
            <InfoRow
              icon={AtSign}
              label="Username"
              value={data?.username ? `@${data.username}` : "—"}
            />
            <InfoRow icon={User} label="Name" value={data?.name || "—"} />
            <InfoRow icon={Store} label="Account" value="Professional" />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="relative mb-4">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#f58529]/20 via-[#dd2a7b]/15 to-[#8134af]/20 blur-md" />
            <div className="relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-[0_8px_24px_rgba(221,42,123,0.28)]">
              <FaInstagram size={28} />
            </div>
            <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-white bg-slate-800 text-white shadow-sm">
              <Link2Off size={13} />
            </span>
          </div>

          <p className="text-sm font-semibold text-gray-700">
            Instagram not linked
          </p>
          <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-slate-500">
            This Facebook Page has no Instagram professional account connected
            yet.
          </p>

          <div className="mt-4 w-full space-y-2 rounded-xl border border-dashed border-pink-200 bg-gradient-to-br from-orange-50/80 via-pink-50/80 to-violet-50/80 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-pink-600">
              To link Instagram
            </p>
            <div className="space-y-1.5 text-left">
              <EmptyHint text="Convert the profile to a professional account" />
              <EmptyHint text="Connect it to this Facebook Page in Meta" />
              <EmptyHint text="Reconnect Facebook here to sync it" />
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 text-xs text-slate-600">
      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-linear-to-br from-[#f58529] to-[#dd2a7b]" />
      <span>{text}</span>
    </div>
  );
}
