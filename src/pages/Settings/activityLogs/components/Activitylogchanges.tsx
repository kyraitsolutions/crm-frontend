import type { ActivityLog } from "../types/activity-log.type";

import { getDisplayableChanges } from "../utils/activity-logs.utils";
import { ChangeRenderer } from "./ChangeRenderer";

interface ActivityLogChangesProps {
  log: ActivityLog;
}

export function ActivityLogChanges({ log }: ActivityLogChangesProps) {
  const changes = getDisplayableChanges(log.changes);

  if (!changes.length) {
    return null;
  }

  return (
    <div className="mt-3 space-y-2 rounded-xl border border-dashed border-border bg-muted/20 p-3">
      {changes.map(({ key, label, change }) => (
        <div key={key} className="flex items-start gap-3">
          <span className="min-w-20 text-[11px] font-medium text-muted-foreground">
            {label}
          </span>

          <ChangeRenderer from={change.from} to={change.to} />
        </div>
      ))}
    </div>
  );
}

// import type { ActivityLog } from "../types/activity-log.type";

// import {
//   formatChangeValue,
//   getDisplayableChanges,
// } from "../utils/activity-logs.utils";
// import { ChangeValue } from "./ChangeValue";

// interface ActivityLogChangesProps {
//   log: ActivityLog;
// }

// export function ActivityLogChanges({ log }: ActivityLogChangesProps) {
//   const changes = getDisplayableChanges(log.changes);

//   if (!changes.length) {
//     return null;
//   }

//   return (
//     <div className="mt-3 space-y-2 rounded-xl border border-dashed border-border bg-muted/20 p-3">
//       {changes.map(({ key, label, change }) => {
//         const from = formatChangeValue(change.from);
//         const to = formatChangeValue(change.to);

//         return (
//           <div key={key} className="flex flex-wrap items-start gap-2 text-xs">
//             <span className="min-w-20 shrink-0 text-[11px] font-medium text-muted-foreground">
//               {label}
//             </span>

//             <div className="flex flex-wrap items-center gap-1.5">
//               {from.type !== "empty" && (
//                 <>
//                   <ChangeValue value={from} variant="from" />

//                   <i
//                     className="ti-arrow-right text-[9px] text-muted-foreground"
//                     aria-hidden="true"
//                   />
//                 </>
//               )}

//               <ChangeValue value={to} variant="to" />
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// import { cn } from "@/lib/utils";
// import type { ActivityLog } from "../types/activity-log.type";
// import {
//   formatFieldValue,
//   getDisplayableChanges,
// } from "../utils/activity-logs.utils";

// interface ActivityLogChangesProps {
//   log: ActivityLog;
// }

// const SOURCE_ICONS: Record<string, string> = {
//   phone_call: "ti-phone",
//   email: "ti-mail",
//   meeting: "ti-calendar-event",
//   sms: "ti-message",
// };

// export function ActivityLogChanges({ log }: ActivityLogChangesProps) {
//   const changes = getDisplayableChanges(log.changes);
//   if (changes.length === 0) return null;

//   return (
//     <div className="mt-3 space-y-2 rounded-xl border border-dashed border-border bg-muted/20 p-3">
//       {changes.map(({ key, label, change, type }) => {
//         // if (type === "notes") {
//         //   const { added, removed } = getNotesDiff(change);
//         //   return (
//         //     <div key={key} className="space-y-1.5">
//         //       {added.map((note) => (
//         //         <div
//         //           key={note.id}
//         //           className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50/60 px-2.5 py-2"
//         //         >
//         //           <i
//         //             className={cn(
//         //               SOURCE_ICONS[note.activitySource ?? ""] ?? "ti-note",
//         //               "mt-0.5 text-[12px] text-emerald-600 shrink-0",
//         //             )}
//         //             aria-hidden="true"
//         //           />
//         //           <div className="min-w-0">
//         //             <p className="text-[11px] font-medium text-emerald-700">
//         //               Note added
//         //             </p>
//         //             <p className="mt-0.5 truncate text-xs text-emerald-800 leading-relaxed">
//         //               {note.message}
//         //             </p>
//         //           </div>
//         //         </div>
//         //       ))}
//         //       {removed.map((note) => (
//         //         <div
//         //           key={note.id}
//         //           className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50/60 px-2.5 py-2"
//         //         >
//         //           <i
//         //             className="ti-note mt-0.5 text-[12px] text-red-500 shrink-0"
//         //             aria-hidden="true"
//         //           />
//         //           <div className="min-w-0">
//         //             <p className="text-[11px] font-medium text-red-600">
//         //               Note removed
//         //             </p>
//         //             <p className="mt-0.5 truncate text-xs text-red-700 line-through">
//         //               {note.message}
//         //             </p>
//         //           </div>
//         //         </div>
//         //       ))}
//         //     </div>
//         //   );
//         // }

//         // Scalar / default diff row
//         const fromVal = formatFieldValue(change.from);
//         const toVal = formatFieldValue(change.to);
//         const hasFrom = fromVal !== "—";

//         return (
//           <div key={key} className="flex flex-wrap items-center gap-2 text-xs">
//             <span className="min-w-20 shrink-0 text-[11px] font-medium text-muted-foreground">
//               {label}
//             </span>
//             <div className="flex items-center gap-1.5 flex-wrap">
//               {hasFrom && (
//                 <>
//                   <code className="rounded bg-red-50 px-1.5 py-0.5 font-mono text-xs text-red-600 line-through">
//                     {fromVal}
//                   </code>
//                   <i
//                     className="ti-arrow-right text-[9px] text-muted-foreground"
//                     aria-hidden="true"
//                   />
//                 </>
//               )}

//               <code className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-xs text-emerald-700">
//                 {toVal}
//               </code>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }
