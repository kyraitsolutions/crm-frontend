import { diffArray } from "../utils/activity-logs.utils";

interface ArrayChangeProps {
  from: unknown[];
  to: unknown[];
}

export function ArrayChange({ from, to }: ArrayChangeProps) {
  const { added, removed } = diffArray(from, to);

  return (
    <div className="space-y-1">
      {removed.map((item) => (
        <div
          key={item.key}
          className="rounded bg-red-50 px-2 py-1 text-xs text-red-600 line-through"
        >
          {item.label}
        </div>
      ))}

      {added.map((item) => (
        <div
          key={item.key}
          className="rounded bg-emerald-50 px-2 py-1 text-xs text-emerald-700"
        >
          {item.label}
        </div>
      ))}

      {!added.length && !removed.length && (
        <span className="text-xs text-muted-foreground">No changes</span>
      )}
    </div>
  );
}
