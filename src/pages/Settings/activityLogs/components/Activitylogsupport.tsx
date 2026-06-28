// ─── ActivityLogFilter ────────────────────────────────────────────────────────
import { cn } from "@/lib/utils";
import type { FilterActor } from "../utils/activity-logs.utils";

interface ActivityLogFilterProps {
  value: FilterActor;
  onChange: (v: FilterActor) => void;
  counts: Record<FilterActor, number>;
}

const TABS: { key: FilterActor; label: string }[] = [
  { key: "all", label: "All" },
  { key: "user", label: "Users" },
  { key: "automation", label: "Automation" },
  { key: "system", label: "System" },
];

export function ActivityLogFilter({
  value,
  onChange,
  counts,
}: ActivityLogFilterProps) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg border bg-muted/30 p-1">
      {TABS.map((t) => {
        const count = counts[t.key] ?? 0;
        if (t.key !== "all" && count === 0) return null;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
              value === t.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-px text-[10px]",
                value === t.key
                  ? "bg-muted text-muted-foreground"
                  : "text-muted-foreground/60",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── ActivityLogDateGroup ────────────────────────────────────────────────────

interface ActivityLogDateGroupProps {
  label: string;
}

export function ActivityLogDateGroup({ label }: ActivityLogDateGroupProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="h-px flex-1 bg-border" />
      <span className="shrink-0 rounded-full border bg-background px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

// ─── ActivityLogEmpty ────────────────────────────────────────────────────────

export function ActivityLogEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-muted/30">
        <i
          className="ti-timeline text-xl text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      <p className="mt-3 text-sm font-medium text-foreground">
        No activity yet
      </p>
      <p className="mt-1 text-xs text-muted-foreground max-w-[200px] leading-relaxed">
        Events on this record will appear here as they happen.
      </p>
    </div>
  );
}
