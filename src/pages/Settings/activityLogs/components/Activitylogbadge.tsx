import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { BadgeStyle } from "../types/activity-log.type";

interface ActivityLogBadgeProps {
  label: string;
  icon?: LucideIcon;
  badge: BadgeStyle;
  className?: string;
}

export function ActivityLogBadge({
  label,
  icon: Icon,
  badge,
  className,
}: ActivityLogBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border px-1.5 py-0.5 text-xs font-medium",
        badge.bg,
        badge.text,
        badge.border,
        className,
      )}
    >
      {Icon && <Icon className="size-3" aria-hidden="true" />}
      {label}
    </span>
  );
}
// import { cn } from "@/lib/utils";
// import {
//   getActionConfig,
//   getEntityConfig,
// } from "../constants/activity.constants";

// interface EntityBadgeProps {
//   entityType: string;
//   className?: string;
// }

// export function EntityBadge({ entityType, className }: EntityBadgeProps) {
//   const cfg = getEntityConfig(entityType);
//   const Icon = cfg.icon;
//   return (
//     <span
//       className={cn(
//         "inline-flex items-center gap-1 rounded-xl border px-1.5 py-0.5 text-xs font-medium",
//         cfg.colorClass,
//         cfg.textClass,
//         cfg.borderClass,
//         className,
//       )}
//     >
//       {Icon && <Icon className="size-3" aria-hidden="true" />}
//       {cfg.label}
//     </span>
//   );
// }

// interface ActionVerbBadgeProps {
//   verb: string; // the part after the dot, e.g. "updated"
//   className?: string;
// }

// const SENTIMENT_BADGE: Record<string, string> = {
//   neutral: "bg-gray-100 text-gray-600",
//   positive: "bg-emerald-50 text-emerald-700",
//   warning: "bg-amber-50 text-amber-700",
//   danger: "bg-red-50 text-red-600",
// };

// export function ActionVerbBadge({ verb, className }: ActionVerbBadgeProps) {
//   const cfg = getActionConfig(verb);
//   return (
//     <span
//       className={cn(
//         "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium",
//         SENTIMENT_BADGE[cfg.sentiment],
//         className,
//       )}
//     >
//       {cfg.label}
//     </span>
//   );
// }
