import { Ban, CheckCircle2, CircleAlert, Loader2, Pause, Upload } from "lucide-react";
import type { ImportStatus } from "../types/import.schema";

const STATUS_UI: Record<
  ImportStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  uploaded: { label: "Uploaded", icon: Upload, className: "bg-slate-100 text-slate-800" },
  scanning: { label: "Scanning", icon: Loader2, className: "bg-amber-50 text-amber-800" },
  validating: { label: "Validating", icon: Loader2, className: "bg-amber-50 text-amber-800" },
  mapping: { label: "Mapping", icon: CircleAlert, className: "bg-sky-50 text-sky-800" },
  queued: { label: "Queued", icon: Loader2, className: "bg-sky-50 text-sky-800" },
  processing: { label: "Processing", icon: Loader2, className: "bg-sky-50 text-sky-800" },
  paused: { label: "Paused", icon: Pause, className: "bg-amber-50 text-amber-800" },
  completed: { label: "Completed", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-800" },
  completed_with_errors: {
    label: "Completed with errors",
    icon: CircleAlert,
    className: "bg-orange-50 text-orange-800",
  },
  failed: { label: "Failed", icon: CircleAlert, className: "bg-red-50 text-red-800" },
  cancelled: { label: "Cancelled", icon: Ban, className: "bg-slate-100 text-slate-700" },
};

export function ImportStatusBadge({ status }: { status: ImportStatus }) {
  const ui = STATUS_UI[status];
  const Icon = ui.icon;
  const spin = status === "scanning" || status === "validating" || status === "processing" || status === "queued";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${ui.className}`}
    >
      <Icon className={`size-3.5 ${spin ? "animate-spin" : ""}`} aria-hidden />
      <span>{ui.label}</span>
    </span>
  );
}

export function importStatusLabel(status: ImportStatus): string {
  return STATUS_UI[status].label;
}
