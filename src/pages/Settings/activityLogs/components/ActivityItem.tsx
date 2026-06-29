import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import type { ActivityLog } from "../types/activity-log.type";

import { cn } from "@/lib/utils";
import { getActionConfig, parseAction } from "../utils/action.utils";
import { getEntityConfig } from "../utils/entity.utils";
// import { ActivityLogAvatar } from "./Activitylogavatar";
import { ActivityLogBadge } from "./Activitylogbadge";
import { getActorConfig } from "../utils/actor.utils";
import { ActivityLogChanges } from "./Activitylogchanges";
import {
  // getActivitySubtitle,
  getActivitySummary,
  hasDisplayableChanges,
} from "../utils/activity-logs.utils";

interface ActivityLogItemProps {
  log: ActivityLog;
  isLast: boolean;
}

export function ActivityLogItem({ log, isLast }: ActivityLogItemProps) {
  const [open, setOpen] = useState(false);
  const { verb } = parseAction(log.action);
  const hasChanges = hasDisplayableChanges(log);
  // const subtitle = getActivitySubtitle(log);

  const actorCfg = getActorConfig(log.actor.type);
  const entityCfg = getEntityConfig(log.entityType);
  const actionCfg = getActionConfig(verb);

  const Icon = actionCfg.icon;

  return (
    <div className="group flex gap-3">
      {/* ── Left: icon + connector ── */}
      <div className="flex flex-col items-center pt-0.5">
        <div
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-1 ring-border",
            actionCfg.timeline.bg,
            actionCfg.timeline.text,
          )}
        >
          {Icon && <Icon className="h-4 w-4" />}
        </div>
        {!isLast && <div className="w-px mt-1 h-full bg-primary/30" />}
      </div>

      {/* ── Right: content card ── */}
      <div className={cn("flex-1 min-w-0", !isLast && "p-2")}>
        {/* Top row: badges + timestamp */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <ActivityLogBadge
                label={entityCfg.label}
                icon={entityCfg.icon}
                badge={entityCfg.badge}
              />

              <ActivityLogBadge
                label={actionCfg.label}
                // icon={actionCfg.icon}
                badge={actionCfg.badge}
              />
            </div>
          </div>
          <time
            dateTime={log.createdAt}
            className="text-[11px] text-muted-foreground tabular-nums"
            title={new Date(log.createdAt).toLocaleString()}
          >
            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
          </time>
        </div>

        {/* Summary */}
        <p className="mt-1.5 text-sm font-medium leading-snug text-foreground">
          {getActivitySummary(log)}
        </p>

        {/* Subtitle (note preview / stage arrow / etc.) */}
        {/* {subtitle && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground italic leading-relaxed">
            {subtitle}
          </p>
        )} */}

        {/* Actor row */}
        <div className="mt-2 flex items-center gap-2">
          {/* <ActivityLogAvatar actor={log.actor} size="sm" /> */}
          <span className="text-xs text-muted-foreground flex gap-2">
            <span
              className={cn(
                "rounded px-1 py-0.5 text-[10px] font-medium",
                actorCfg.badge.bg,
                actorCfg.badge.text,
              )}
            >
              {actorCfg.label}
            </span>

            <span className="font-medium text-foreground">
              {log.actor.name}
            </span>
          </span>
        </div>

        {/* Expandable diff */}
        {hasChanges && (
          <>
            <button
              onClick={() => setOpen((p) => !p)}
              className="mt-2 flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
              aria-expanded={open}
            >
              <i
                className={cn(
                  "ti-chevron-right text-[10px] transition-transform duration-150",
                  open && "rotate-90",
                )}
                aria-hidden="true"
              />
              {open ? "Hide changes" : "View changes"}
            </button>
            {open && <ActivityLogChanges log={log} />}
          </>
        )}
      </div>
    </div>
  );
}

// import { formatDistanceToNow, format } from "date-fns";
// import type { ActivityLog } from "../types/activity-log.type";

// function IconEdit(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       viewBox="0 0 20 20"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={1.75}
//       {...props}
//     >
//       <path
//         d="M13.586 3.586a2 2 0 112.828 2.828l-8.5 8.5A2 2 0 016.5 15.5H5a.5.5 0 01-.5-.5v-1.5a2 2 0 01.586-1.414l8.5-8.5z"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }

// function IconUserPlus(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       viewBox="0 0 20 20"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={1.75}
//       {...props}
//     >
//       <path
//         d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM2 17a7 7 0 0111.9-5M17 14v4m-2-2h4"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }

// function IconDelete(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       viewBox="0 0 20 20"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={1.75}
//       {...props}
//     >
//       <path
//         d="M9 2h2a1 1 0 011 1v1H7V3a1 1 0 011-1zM4 6h12l-1.2 11.1A1 1 0 0113.8 18H6.2a1 1 0 01-1-0.9L4 6zM8 10v5M12 10v5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }

// function IconNote(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       viewBox="0 0 20 20"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={1.75}
//       {...props}
//     >
//       <path
//         d="M4 4h12v8l-4 4H4V4z"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path d="M12 12v4M12 12h4" strokeLinecap="round" strokeLinejoin="round" />
//       <path d="M7 8h6M7 11h4" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// }

// const ACTION_CONFIG: Record<
//   string,
//   {
//     icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
//     label: string;
//     color: string; // Tailwind ring/bg color class
//     iconColor: string; // Tailwind text color class
//     dotColor: string;
//   }
// > = {
//   "lead.updated": {
//     icon: IconEdit,
//     label: "Updated",
//     color: "bg-violet-50 ring-violet-200",
//     iconColor: "text-violet-600",
//     dotColor: "bg-violet-500",
//   },
//   "lead.created": {
//     icon: IconUserPlus,
//     label: "Created",
//     color: "bg-green-50 ring-green-200",
//     iconColor: "text-green-600",
//     dotColor: "bg-green-500",
//   },
//   "lead.deleted": {
//     icon: IconDelete,
//     label: "Deleted",
//     color: "bg-red-50 ring-red-200",
//     iconColor: "text-red-600",
//     dotColor: "bg-red-500",
//   },
//   "contact.created": {
//     icon: IconUserPlus,
//     label: "Created",
//     color: "bg-blue-50 ring-blue-200",
//     iconColor: "text-blue-600",
//     dotColor: "bg-blue-500",
//   },
//   "contact.updated": {
//     icon: IconEdit,
//     label: "Updated",
//     color: "bg-blue-50 ring-blue-200",
//     iconColor: "text-blue-600",
//     dotColor: "bg-blue-500",
//   },
//   "note.added": {
//     icon: IconNote,
//     label: "Note",
//     color: "bg-amber-50 ring-amber-200",
//     iconColor: "text-amber-600",
//     dotColor: "bg-amber-500",
//   },
// };

// function getConfig(action: string) {
//   return (
//     ACTION_CONFIG[action] ?? {
//       icon: IconEdit,
//       label: "Activity",
//       color: "bg-gray-50 ring-gray-200",
//       iconColor: "text-gray-600",
//       dotColor: "bg-gray-400",
//     }
//   );
// }

// function moduleLabel(entityType: string) {
//   return entityType.charAt(0).toUpperCase() + entityType.slice(1);
// }

// function actionVerb(action: string) {
//   const part = action.split(".")[1] ?? "changed";
//   return part.charAt(0).toUpperCase() + part.slice(1);
// }

// // ─── Smart field renderers ─────────────────────────────────────────────────────

// function isObject(v: unknown): v is Record<string, unknown> {
//   return typeof v === "object" && v !== null && !Array.isArray(v);
// }

// function formatValue(v: unknown): string {
//   if (v === null || v === undefined || v === "") return "—";
//   if (typeof v === "string") {
//     // ISO date
//     if (/^\d{4}-\d{2}-\d{2}T/.test(v)) {
//       try {
//         return format(new Date(v), "MMM d, yyyy HH:mm");
//       } catch {
//         /* fall through */
//       }
//     }
//     return v;
//   }
//   if (typeof v === "number" || typeof v === "boolean") return String(v);
//   return JSON.stringify(v);
// }

// type NoteEntry = {
//   message?: string;
//   activitySource?: string;
//   createdAt?: string;
//   id?: string;
// };

// function NoteDiff({ from, to }: { from: NoteEntry[]; to: NoteEntry[] }) {
//   const added = to.filter((n) => !from.some((f) => f.id === n.id));
//   const removed = from.filter((f) => !to.some((n) => n.id === f.id));

//   return (
//     <div className="space-y-1.5">
//       {added.map((n) => (
//         <div
//           key={n.id}
//           className="flex items-start gap-2 rounded-md bg-green-50 border border-green-200 px-3 py-2"
//         >
//           <span className="mt-0.5 text-green-500 text-xs font-bold shrink-0">
//             +
//           </span>
//           <div className="min-w-0">
//             <p className="text-sm text-gray-800 break-words">
//               {n.message || "—"}
//             </p>
//             {n.activitySource && (
//               <p className="text-xs text-gray-400 mt-0.5 capitalize">
//                 via {n.activitySource}
//               </p>
//             )}
//           </div>
//         </div>
//       ))}
//       {removed.map((n) => (
//         <div
//           key={n.id}
//           className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2"
//         >
//           <span className="mt-0.5 text-red-400 text-xs font-bold shrink-0">
//             −
//           </span>
//           <p className="text-sm text-gray-500 line-through break-words">
//             {n.message || "—"}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }

// const SKIP_FIELDS = new Set(["meta", "updatedAt", "createdAt", "__v"]);

// const FIELD_LABELS: Record<string, string> = {
//   firstName: "First Name",
//   lastName: "Last Name",
//   email: "Email",
//   phone: "Phone",
//   status: "Status",
//   assignedTo: "Assigned To",
//   source: "Source",
//   notes: "Notes",
//   tags: "Tags",
//   company: "Company",
//   title: "Title",
//   score: "Lead Score",
// };

// function FieldLabel({ field }: { field: string }) {
//   const label =
//     FIELD_LABELS[field] ??
//     field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
//   return (
//     <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide w-28 shrink-0 pt-0.5">
//       {label}
//     </span>
//   );
// }

// function ChangeRow({
//   field,
//   change,
// }: {
//   field: string;
//   change: { from: unknown; to: unknown };
// }) {
//   // Notes array
//   if (
//     field === "notes" &&
//     (Array.isArray(change.from) || Array.isArray(change.to))
//   ) {
//     return (
//       <div className="space-y-1">
//         <FieldLabel field={field} />
//         <NoteDiff
//           from={Array.isArray(change.from) ? change.from : []}
//           to={Array.isArray(change.to) ? change.to : []}
//         />
//       </div>
//     );
//   }

//   // Object diff — flatten one level
//   if (isObject(change.from) && isObject(change.to)) {
//     const allKeys = new Set([
//       ...Object.keys(change.from),
//       ...Object.keys(change.to),
//     ]);
//     const meaningful = [...allKeys].filter((k) => {
//       const fv = formatValue(change.from[k]);
//       const tv = formatValue(change.to[k]);
//       return fv !== tv && fv !== "—" && tv !== "—";
//     });
//     if (meaningful.length === 0) return null;
//     return (
//       <div className="space-y-1">
//         {meaningful.map((k) => (
//           <ChangeRow
//             key={k}
//             field={k}
//             change={{
//               from: (change.from as Record<string, unknown>)[k],
//               to: (change.to as Record<string, unknown>)[k],
//             }}
//           />
//         ))}
//       </div>
//     );
//   }

//   const fromStr = formatValue(change.from);
//   const toStr = formatValue(change.to);
//   if (fromStr === toStr) return null;

//   const isAddition = fromStr === "—" || fromStr === "";
//   const isRemoval = toStr === "—" || toStr === "";

//   return (
//     <div className="flex items-start gap-2">
//       <FieldLabel field={field} />
//       <div className="flex items-center gap-2 flex-wrap min-w-0">
//         {!isAddition && (
//           <span
//             className="inline-flex items-center rounded bg-red-50 border border-red-200 px-2 py-0.5 text-xs text-red-700 font-medium line-through max-w-[200px] truncate"
//             title={fromStr}
//           >
//             {fromStr}
//           </span>
//         )}
//         {!isAddition && !isRemoval && (
//           <svg
//             className="w-3 h-3 text-gray-400 shrink-0"
//             fill="none"
//             viewBox="0 0 16 16"
//           >
//             <path
//               d="M3 8h10M9 4l4 4-4 4"
//               stroke="currentColor"
//               strokeWidth="1.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         )}
//         {!isRemoval && (
//           <span
//             className="inline-flex items-center rounded bg-green-50 border border-green-200 px-2 py-0.5 text-xs text-green-700 font-medium max-w-[200px] truncate"
//             title={toStr}
//           >
//             {toStr}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// }

// export function ActivityLogItem({ log }: { log: ActivityLog }) {
//   const cfg = getConfig(log.action);
//   const Icon = cfg.icon;

//   const relevantChanges = Object.entries(log.changes || {}).filter(
//     ([key]) => !SKIP_FIELDS.has(key),
//   );

//   const actorName =
//     log.actor?.name && log.actor.name !== "undefined"
//       ? log.actor.name
//       : log.actor?.type === "system"
//         ? "System"
//         : null;

//   const entityName =
//     log.metadata?.leadName ||
//     log.metadata?.contactName ||
//     log.metadata?.name ||
//     null;

//   return (
//     <div className="relative flex gap-4 group">
//       {/* Timeline spine rendered by parent container (see ActivityLogLists) */}

//       {/* Icon badge */}
//       <div
//         className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-2 ${cfg.color}`}
//       >
//         <Icon className={`h-4 w-4 ${cfg.iconColor}`} />
//       </div>

//       {/* Content card */}
//       <div className="flex-1 pb-6">
//         {/* Header */}
//         <div className="flex flex-wrap items-center gap-2 mb-1">
//           {/* Module badge */}
//           <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700 uppercase tracking-wide">
//             {moduleLabel(log.entityType)}
//           </span>

//           {/* Action verb */}
//           <span
//             className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
//               log.action.includes("created")
//                 ? "bg-green-100 text-green-700"
//                 : log.action.includes("deleted")
//                   ? "bg-red-100 text-red-700"
//                   : "bg-gray-100 text-gray-600"
//             }`}
//           >
//             {actionVerb(log.action)}
//           </span>

//           {/* Entity name */}
//           {entityName && (
//             <span className="text-sm font-semibold text-gray-900">
//               {entityName}
//             </span>
//           )}
//         </div>

//         {/* Timestamp + actor */}
//         <p className="text-xs text-gray-400 mb-3">
//           {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
//           {" · "}
//           {format(new Date(log.createdAt), "MMM d, yyyy 'at' HH:mm")}
//           {actorName && (
//             <>
//               {" "}
//               · <span className="text-gray-500 font-medium">{actorName}</span>
//             </>
//           )}
//         </p>

//         {/* Changes */}
//         {relevantChanges.length > 0 && (
//           <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 space-y-2.5">
//             {relevantChanges.map(([key, value]: [string, any]) => (
//               <ChangeRow key={key} field={key} change={value} />
//             ))}
//           </div>
//         )}

//         {/* Created with no changes */}
//         {relevantChanges.length === 0 && log.action.includes("created") && (
//           <p className="text-xs text-gray-400 italic">
//             Record created via {log.metadata?.source?.name || "manual"} entry.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// import { formatDistanceToNow } from "date-fns";
// import type { ActivityLog } from "../types/activity-log.type";
// import {
//   getActivityIcon,
//   getActivityMessage,
// } from "../utils/activity-logs.utils";

// export function ActivityLogItem({ log }: { log: ActivityLog }) {
//   const Icon = getActivityIcon(log.action);

//   return (
//     <div className="flex gap-4">
//       <div className="flex h-10 w-10 items-center justify-center rounded-full border">
//         <Icon className="h-4 w-4" />
//       </div>

//       <div className="flex-1">
//         <p className="font-medium">{getActivityMessage(log)}</p>

//         <p className="text-muted-foreground text-sm">
//           {formatDistanceToNow(new Date(log.createdAt), {
//             addSuffix: true,
//           })}
//         </p>

//         {Object.keys(log.changes || {}).length > 0 && (
//           <div className="mt-3 rounded-md border bg-muted/30 p-3">
//             {Object.entries(log.changes).map(([key, value]: any) => (
//               <div key={key} className="flex gap-2 text-sm">
//                 <span className="font-medium">{key}</span>

//                 {value.from && (
//                   <>
//                     <span>{String(value.from)}</span>→
//                   </>
//                 )}

//                 <span>{String(value.to)}</span>
//               </div>
//             ))}
//           </div>
//         )}

//         <div>
//           <p>By {log.actor.type}</p>
//           <p>{log.actor.name}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
