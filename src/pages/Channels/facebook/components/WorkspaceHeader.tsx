import {
  BadgeCheck,
  CheckCircle2,
  Instagram,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { GlassCard } from "@/pages/Channels/whatsapp/components/cards/GlassCard";
import FloatingDots from "@/pages/Channels/whatsapp/components/FloatingDots";

export interface WorkspaceHeaderProps {
  pageName?: string;
  category?: string | null;
  instagramUsername?: string | null;
}

export function WorkspaceHeader({
  pageName,
  category,
  instagramUsername,
}: WorkspaceHeaderProps) {
  return (
    <GlassCard className="relative overflow-hidden bg-slate-900 px-5 py-6 rounded-2xl">
      <div className="absolute -right-14 -top-14 size-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="relative flex items-center justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400">
              Facebook Page Connected
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            {pageName || "Facebook Page"}
            <BadgeCheck className="size-7 text-blue-500" />
          </h1>

          <p className="max-w-[420px] text-sm leading-relaxed text-slate-500">
            Your Facebook Page is connected and ready to capture leads and
            conversations.
          </p>

          <div className="flex flex-wrap gap-2.5 text-sm">
            <div className="flex items-center gap-1.5 rounded-2xl bg-blue-950 px-3 py-1.5 ring-1 ring-blue-600">
              <Zap className="size-3.5 fill-blue-400 text-blue-400" />
              <span className="font-semibold text-blue-400">LIVE</span>
            </div>

            {category ? (
              <div className="flex items-center gap-1.5 rounded-2xl bg-slate-800 px-3 py-1.5 ring-1 ring-slate-600">
                <ShieldCheck className="size-3.5 text-slate-300" />
                <span className="font-semibold text-slate-300">{category}</span>
              </div>
            ) : null}

            {instagramUsername ? (
              <div className="flex items-center gap-1.5 rounded-2xl bg-pink-950/60 px-3 py-1.5 ring-1 ring-pink-800">
                <Instagram className="size-3.5 text-pink-400" />
                <span className="font-semibold text-pink-400">
                  @{instagramUsername}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="relative hidden lg:flex lg:size-52 lg:items-center lg:justify-center">
          <div className="absolute size-40 rounded-full bg-blue-500/15 blur-[50px]" />
          <div className="absolute size-48 rounded-full border border-blue-300/15" />
          <div className="absolute size-[152px] rounded-full border border-blue-300/22" />
          <div className="absolute size-28 rounded-full border border-blue-300/30" />

          <div className="relative z-10 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-blue-700 shadow-[0_0_50px_rgba(37,99,235,0.5),0_0_100px_rgba(37,99,235,0.2)]">
            <FaFacebook size={36} className="text-white" />
          </div>

          <FloatingDots />
        </div>
      </div>
    </GlassCard>
  );
}
