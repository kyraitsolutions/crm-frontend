import { cn } from "@/lib/utils";
import type { FormattedChangeValue } from "../types/activity-log.type";

interface ChangeValueProps {
  value: FormattedChangeValue;
  variant: "from" | "to";
}

export function ChangeValue({ value, variant }: ChangeValueProps) {
  const className = cn(
    "rounded px-1.5 py-0.5 font-mono text-xs",
    variant === "from"
      ? "bg-red-50 text-red-600 line-through"
      : "bg-emerald-50 text-emerald-700",
  );

  if (value.type === "array") {
    return (
      <div className="space-y-1">
        {value.items?.map((item) => (
          <code key={item} className={cn("block", className)}>
            {item}
          </code>
        ))}
      </div>
    );
  }

  return <code className={className}>{value.value}</code>;
}
