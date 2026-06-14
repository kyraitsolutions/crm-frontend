import {
  BadgeCheck,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { GlassCard } from "./cards/GlassCard";
import FloatingDots from "./FloatingDots";

export interface WorkspaceHeaderProps {
  businessName: string;
  phoneNumber: string;
}

export function WorkspaceHeader({
  businessName,
  phoneNumber,
}: WorkspaceHeaderProps) {
  return (
    <GlassCard className="relative overflow-hidden bg-slate-900 px-9 py-8">
      {/* Glow background */}
      <div className="absolute -right-14 -top-14 size-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Particles */}
      <div className="absolute left-100 top-14 size-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_2px_rgba(34,211,238,0.9)]" />
      <div className="absolute left-120 top-28 size-1 rounded-full bg-violet-500 shadow-[0_0_10px_2px_rgba(168,85,247,0.9)]" />
      <div className="absolute left-130 bottom-12 size-2 rounded-full bg-emerald-400 shadow-[0_0_14px_3px_rgba(74,222,128,0.8)]" />
      <div className="absolute right-60 top-10 size-1 rounded-full bg-blue-400 shadow-[0_0_10px_2px_rgba(96,165,250,0.9)]" />
      <div className="absolute right-56 bottom-14 size-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_2px_rgba(34,211,238,0.9)]" />
      <div className="absolute left-44 bottom-8 size-1 rounded-full bg-pink-400 shadow-[0_0_8px_2px_rgba(244,114,182,0.8)]" />

      <div className="relative flex items-center justify-between">
        {/* LEFT */}
        <div className="space-y-4">
          {/* Connected badge */}
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-500">
              WhatsApp Business Connected
            </span>
          </div>

          {/* Business name */}
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            {businessName}
            <BadgeCheck className="size-7 text-blue-500" />
          </h1>

          {/* Subtitle */}
          <p className="max-w-[420px] text-sm leading-relaxed text-slate-500">
            Your WhatsApp Business Platform is connected and ready to grow your
            conversations.
          </p>

          {/* Pills */}
          <div className="flex flex-wrap gap-2.5 text-sm">
            <div className="flex items-center gap-1.5 rounded-xl bg-emerald-950 px-3 py-1.5 ring-1 ring-green-600">
              <Zap className="size-3.5 fill-emerald-400 text-emerald-400" />
              <span className="font-semibold text-emerald-400">LIVE</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-1.5 ring-1 ring-slate-600">
              <Smartphone className="size-3.5 text-slate-300" />
              <span className="font-semibold text-slate-300">
                {phoneNumber}
              </span>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-blue-950/60 px-3 py-1.5 ring-1 ring-blue-800">
              <ShieldCheck className="size-3.5 text-blue-400" />
              <span className="font-semibold text-blue-400">
                WABA Connected
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — WhatsApp Orb */}
        <div className="relative hidden lg:flex lg:size-52 lg:items-center lg:justify-center">
          {/* Blur glow */}
          <div className="absolute size-40 rounded-full bg-emerald-500/15 blur-[50px]" />

          {/* Rings */}
          <div className="absolute size-48 rounded-full border border-emerald-300/15" />
          <div className="absolute size-[152px] rounded-full border border-emerald-300/22" />
          <div className="absolute size-28 rounded-full border border-emerald-300/30" />

          {/* Orb */}
          <div className="relative z-10 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 shadow-[0_0_50px_rgba(34,197,94,0.5),0_0_100px_rgba(34,197,94,0.2)]">
            <FaWhatsapp size={36} className="text-white" />
          </div>

          <FloatingDots />
        </div>
      </div>
    </GlassCard>
  );
}

// import {
//   BadgeCheck,
//   CheckCircle2,
//   ShieldCheck,
//   Smartphone,
//   Zap,
// } from "lucide-react";
// import { FaWhatsapp } from "react-icons/fa";

// import { GlassCard } from "./cards/GlassCard";
// import FloatingDots from "./FloatingDots";

// export interface WorkspaceHeaderProps {
//   businessName: string;
//   phoneNumber: string;
// }

// export function WorkspaceHeader({
//   businessName,
//   phoneNumber,
// }: WorkspaceHeaderProps) {
//   return (
//     <GlassCard className="relative overflow-hidden bg-slate-900 px-4 py-8">
//       {/* Space Particles */}

//       <div className="absolute left-100 top-16 size-1.5 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]" />
//       <div className="absolute left-80 top-32 size-1 rounded-full bg-violet-500 shadow-[0_0_15px_rgba(168,85,247,1)]" />
//       <div className="absolute left-200 bottom-24 size-2 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(74,222,128,1)]" />
//       <div className="absolute right-110 top-20 size-1 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)]" />
//       <div className="absolute right-100 bottom-20 size-1.5 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]" />

//       {/* Background Glow */}
//       <div className="absolute -right-20 -top-20 size-96 rounded-full bg-emerald-500/10 blur-3xl" />

//       <div className="relative flex items-center justify-between">
//         {/* LEFT */}
//         <div className="space-y-4">
//           <div className="flex items-center gap-2">
//             <CheckCircle2 className="size-5 text-emerald-500" />

//             <span className="text-sm font-semibold text-emerald-600">
//               WhatsApp Connected
//             </span>
//           </div>

//           <h1 className="md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
//             {businessName} <BadgeCheck className="" />
//           </h1>

//           <p className="max-w-xl text-sm text-slate-500">
//             Connected phone number is ready to send and receive messages through
//             WhatsApp Business Platform.
//           </p>

//           {/* Pills */}
//           <div className="flex flex-wrap gap-3 text-sm">
//             <div className="flex items-center gap-1 rounded-xl bg-emerald-950 px-2 py-1.5 shadow-sm ring-1 ring-emerald-600">
//               <Zap className="size-4 text-emerald-400" />
//               <span className="font-medium text-emerald-400">LIVE</span>
//             </div>

//             <div className="flex items-center gap-1 rounded-xl bg-slate-700 px-2 py-1.5 shadow-sm ring-1 ring-slate-600">
//               <Smartphone className="size-4 text-slate-300" />

//               <span className="font-medium text-slate-300">{phoneNumber}</span>
//             </div>

//             <div className="flex items-center gap-1 rounded-xl bg-sky-950 px-2 py-1.5 shadow-sm ring-1 ring-sky-800">
//               <ShieldCheck className="size-4 text-sky-400" />

//               <span className="font-medium text-sky-400">WABA Connected</span>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="relative hidden lg:flex lg:size-50 lg:items-center lg:justify-center">
//           {/* Glow */}
//           <div className="absolute size-60 rounded-full bg-emerald-500/20 blur-[80px]" />

//           {/* Rings */}
//           <div className="absolute size-50 rounded-full border border-emerald-300/20" />
//           <div className="absolute size-40 rounded-full border border-emerald-300/30" />
//           <div className="absolute size-30 rounded-full border border-emerald-300/40" />

//           {/* Orb */}
//           <div className="relative flex size-32 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 via-green-500 to-emerald-600 shadow-[0_0_80px_rgba(34,197,94,0.55)]">
//             <FaWhatsapp size={50} className="text-white" />
//           </div>

//           {/* Floating Dots */}
//           <FloatingDots />
//         </div>
//       </div>
//     </GlassCard>
//   );
// }
