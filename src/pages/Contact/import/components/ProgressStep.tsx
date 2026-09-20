import ConfirmModal from "@/components/confirm";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { importErrorCopy } from "../constants/import.errors";
import { isTerminalImportStatus } from "../constants/import.constant";
import type { ImportJobDoc } from "../types/import.schema";
import { formatEta, formatRowsPerSec } from "../utils/eta";
import { ImportStatusBadge } from "./ImportStatusBadge";
import { ProgressLifecycle } from "./ImportStepper";

interface ProgressStepProps {
  job: ImportJobDoc;
  rowsPerSec: number;
  eta: number | null;
  onPause: () => Promise<void>;
  onResume: () => Promise<void>;
  onCancel: () => Promise<void>;
  onDownloadErrors: () => Promise<void>;
}

export function ProgressStep({
  job,
  rowsPerSec,
  eta,
  onPause,
  onResume,
  onCancel,
  onDownloadErrors,
}: ProgressStepProps) {
  const [confirm, setConfirm] = useState<"pause" | "resume" | "cancel" | null>(null);
  const [busy, setBusy] = useState(false);
  const terminal = isTerminalImportStatus(job.status);
  const percent = job.percent;
  const failedCopy = importErrorCopy(job.errorMessage, undefined, job.errorMessage);
  const live = `${job.processed.toLocaleString()} of ${job.total.toLocaleString()} rows · ${formatRowsPerSec(rowsPerSec)} · ${formatEta(eta)}`;

  const counters = useMemo(
    () => [
      { label: "Inserted", value: job.totals.inserted },
      { label: "Updated", value: job.totals.updated },
      { label: "Skipped", value: job.totals.skipped },
      { label: "Duplicates", value: job.totals.duplicates },
      { label: "Failed", value: job.totals.failed },
    ],
    [job.totals],
  );

  const run = async (kind: "pause" | "resume" | "cancel") => {
    setBusy(true);
    try {
      if (kind === "pause") await onPause();
      if (kind === "resume") await onResume();
      if (kind === "cancel") await onCancel();
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  };

  return (
    <section className="space-y-6" aria-labelledby="import-progress-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 id="import-progress-heading" tabIndex={-1} className="text-xl font-semibold text-primary">
          {job.file.fileName}
        </h1>
        <ImportStatusBadge status={job.status} />
      </div>

      <ProgressLifecycle status={job.status} />

      {!terminal ? (
        <p className="rounded-xl border bg-muted/40 px-3 py-2 text-sm">
          It is safe to leave this page. The import keeps running on the server.
        </p>
      ) : null}

      <div className="min-h-[92px] space-y-3">
        <div
          className="h-3 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label="Import progress"
        >
          <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${percent}%` }} />
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {live}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {counters.map((item) => (
            <div key={item.label} className="min-h-[72px] rounded-xl border px-3 py-2">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-lg font-semibold tabular-nums">{item.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
        {terminal ? (
          <p className="text-sm text-muted-foreground">
            Inserted are new contacts. Updated changed an existing match. Skipped already matched
            and did not change (or you chose Skip). Failed rows are listed below and in the error
            report.
          </p>
        ) : null}
      </div>

      {!terminal ? (
        <div className="flex flex-wrap gap-2">
          {job.status === "processing" ? (
            <Button type="button" variant="outline" onClick={() => setConfirm("pause")}>
              Pause
            </Button>
          ) : null}
          {job.status === "paused" ? (
            <Button type="button" onClick={() => setConfirm("resume")}>
              Resume
            </Button>
          ) : null}
          <Button type="button" variant="destructive" onClick={() => setConfirm("cancel")}>
            Cancel import
          </Button>
        </div>
      ) : null}

      {job.status === "failed" ? (
        <p role="alert" className="text-sm text-red-800">
          {failedCopy.message} {failedCopy.action}
        </p>
      ) : null}

      {terminal && (job.rowErrorPreview?.length ?? 0) > 0 ? (
        <div className="overflow-x-auto rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="p-3 font-medium">Row</th>
                <th className="p-3 font-medium">Reason</th>
                <th className="p-3 font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {job.rowErrorPreview?.map((row) => (
                <tr key={`${row.rowNumber}-${row.reason}`} className="even:bg-muted/40">
                  <td className="p-3">{row.rowNumber}</td>
                  <td className="p-3">{importErrorCopy(row.reason).message}</td>
                  <td className="p-3">{row.rawValue ?? row.raw?.join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {job.errorReportAvailable ? (
        <Button type="button" variant="outline" onClick={() => void onDownloadErrors()}>
          Download error report
        </Button>
      ) : null}

      <ConfirmModal
        isOpen={confirm !== null}
        title={
          confirm === "cancel"
            ? "Cancel this import?"
            : confirm === "pause"
              ? "Pause this import?"
              : "Resume this import?"
        }
        description={
          confirm === "cancel"
            ? "Rows already written stay. Remaining rows will not be imported."
            : confirm === "pause"
              ? "The current chunk will finish, then the import waits."
              : "The import will continue from where it stopped."
        }
        confirmText={confirm === "cancel" ? "Cancel import" : confirm === "pause" ? "Pause" : "Resume"}
        loading={busy}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm) return run(confirm);
        }}
      />
    </section>
  );
}
