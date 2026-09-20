import ConfirmModal from "@/components/confirm";
import DataLoader from "@/components/Loader/data-loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTACT_PATHS } from "@/constants/routes/contact.path";
import { ToastMessageService } from "@/services";
import { useAuthStore } from "@/stores";
import type { ApiError } from "@/types";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ImportErrorAlert, importErrorText } from "../components/ImportErrorAlert";
import { ImportStatusBadge } from "../components/ImportStatusBadge";
import { isTerminalImportStatus } from "../constants/import.constant";
import { useImportHistory } from "../hooks/useImportHistory";
import { contactImportService } from "../services/contact-import.service";
import type { ImportJobDoc, ImportStatus } from "../types/import.schema";

const toast = new ToastMessageService();

const FILTERS: Array<{ value: ImportStatus | "all"; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "processing", label: "Processing" },
  { value: "mapping", label: "Mapping" },
  { value: "completed", label: "Completed" },
  { value: "completed_with_errors", label: "Completed with errors" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "paused", label: "Paused" },
];

export default function ImportHistoryPage() {
  const navigate = useNavigate();
  const { accountId } = useAuthStore((state) => state);
  const id = String(accountId || "");
  const [status, setStatus] = useState<ImportStatus | "">("");
  const [pendingCancel, setPendingCancel] = useState<ImportJobDoc | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const { docs, error, loading, loadingMore, hasMore, loadMore, reload } = useImportHistory(
    id || undefined,
    status,
  );

  return (
    <div className="px-6 py-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-primary">Contact imports</h1>
        <Button asChild>
          <Link to={CONTACT_PATHS.getNew(id)}>New import</Link>
        </Button>
      </div>

      <div className="mb-4 max-w-xs">
        <Label htmlFor="import-status-filter">Status</Label>
        <Select
          value={status || "all"}
          onValueChange={(value) => setStatus(value === "all" ? "" : (value as ImportStatus))}
        >
          <SelectTrigger id="import-status-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILTERS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? <DataLoader className="h-48" /> : null}
      <ImportErrorAlert error={error} />

      {!loading && docs.length === 0 ? (
        <p className="rounded-2xl border px-4 py-10 text-center text-sm text-muted-foreground">
          No imports yet. Upload a CSV or XLSX to add contacts in bulk.
        </p>
      ) : null}

      {!loading && docs.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="p-3 font-medium">File</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Progress</th>
                <th className="p-3 font-medium">Updated</th>
                <th className="p-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              {docs.map((job) => (
                <tr
                  key={job.id}
                  tabIndex={0}
                  className="cursor-pointer even:bg-muted/40 hover:bg-muted/70 focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => navigate(CONTACT_PATHS.getJob(id, job.id))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(CONTACT_PATHS.getJob(id, job.id));
                    }
                  }}
                >
                  <td className="p-3 font-medium">
                    <Link className="underline-offset-2 hover:underline" to={CONTACT_PATHS.getJob(id, job.id)}>
                      {job.file.fileName}
                    </Link>
                  </td>
                  <td className="p-3">
                    <ImportStatusBadge status={job.status} />
                  </td>
                  <td className="p-3 tabular-nums">
                    {job.processed.toLocaleString()} / {job.total.toLocaleString()}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {job.timestamps.updatedAt ? String(job.timestamps.updatedAt) : "—"}
                  </td>
                  <td className="p-3">
                    {isTerminalImportStatus(job.status) ? null : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(event) => {
                          event.stopPropagation();
                          setPendingCancel(job);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <ConfirmModal
        isOpen={pendingCancel !== null}
        title="Cancel this import?"
        description="This job will be closed so you can start a new upload. The file will not be imported."
        confirmText="Cancel import"
        loading={cancelling}
        onCancel={() => setPendingCancel(null)}
        onConfirm={async () => {
          if (!pendingCancel) {
            return;
          }
          setCancelling(true);
          try {
            await contactImportService.cancel(id, pendingCancel.id);
            setPendingCancel(null);
            await reload();
          } catch (err) {
            toast.apiError(importErrorText(err as ApiError));
          } finally {
            setCancelling(false);
          }
        }}
      />

      {hasMore ? (
        <Button type="button" variant="outline" className="mt-4" disabled={loadingMore} onClick={() => void loadMore()}>
          {loadingMore ? "Loading…" : "Load more"}
        </Button>
      ) : null}
    </div>
  );
}
