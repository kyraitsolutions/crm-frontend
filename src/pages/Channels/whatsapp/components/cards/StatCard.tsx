import { GlassCard } from "./GlassCard";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  iconBg: string; // e.g. "bg-violet-500/20"
  iconColor: string; // e.g. "text-violet-400"
  badge?: {
    label: string;
    color: string; // e.g. "bg-green-500/20 text-green-400"
  };
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  badge,
}: StatCardProps) => {
  return (
    <GlassCard className="bg-gray-50 p-5">
      <div className="flex items-center justify-between gap-5">
        {/* Left: icon pill */}
        <div
          className={`flex size-12 rounded-full items-center justify-center ${iconBg}`}
        >
          <Icon size={22} className={iconColor} />
        </div>

        {/* Right: title + value + badge */}
        <div className="flex-1">
          <p className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
            {title}
          </p>
          <h3 className="mt-1.5 truncate text-[15px] font-bold text-gray-600">
            {value}
          </h3>
          {badge && (
            <span
              className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge.color}`}
            >
              {/* dot */}
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
              {badge.label}
            </span>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

// import type { LucideIcon } from "lucide-react";
// import { GlassCard } from "./GlassCard";

// interface Props {
//   title: string;
//   value: string;
//   icon: LucideIcon;
// }

// export function StatCard({ title, value, icon: Icon }: Props) {
//   return (
//     <GlassCard className="p-5">
//       <div className="flex justify-between">
//         <div>
//           <p className="text-sm text-muted-foreground">{title}</p>
//           <h3 className="mt-2 text-lg font-semibold">{value}</h3>
//         </div>

//         <Icon className="text-violet-600" />
//       </div>
//     </GlassCard>
//   );
// }
