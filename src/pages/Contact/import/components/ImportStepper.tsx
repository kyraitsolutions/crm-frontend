import { Check } from "lucide-react";

const STEPS = ["Upload", "Map columns", "Review", "Import"] as const;

export function ImportStepper({
  current,
  labels = STEPS,
}: {
  current: number;
  labels?: readonly string[];
}) {
  return (
    <ol className="mb-6 flex flex-wrap items-center gap-2" aria-label="Import steps">
      {labels.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                done
                  ? "bg-primary text-white"
                  : active
                    ? "border-2 border-primary text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
              aria-current={active ? "step" : undefined}
            >
              {done ? <Check className="size-3.5" aria-hidden /> : index + 1}
            </span>
            <span className={`text-sm ${active ? "font-semibold text-primary" : "text-muted-foreground"}`}>
              {label}
            </span>
            {index < labels.length - 1 ? (
              <span className="mx-1 hidden h-px w-8 bg-border sm:block" aria-hidden />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function ProgressLifecycle({
  status,
}: {
  status: string;
}) {
  const labels = ["Uploaded", "Validating", "Processing", terminalLabel(status)];
  const current =
    status === "uploaded"
      ? 0
      : status === "scanning" || status === "validating"
        ? 1
        : status === "queued" || status === "processing" || status === "paused"
          ? 2
          : 3;
  return <ImportStepper current={current} labels={labels} />;
}

function terminalLabel(status: string): string {
  if (status === "completed_with_errors") {
    return "Completed with errors";
  }
  if (status === "failed") {
    return "Failed";
  }
  if (status === "cancelled") {
    return "Cancelled";
  }
  return "Completed";
}
