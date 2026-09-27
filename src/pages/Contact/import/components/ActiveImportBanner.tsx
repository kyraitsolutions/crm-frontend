import { CONTACT_PATHS } from "@/constants/routes/contact.path";
import { Link } from "react-router-dom";
import { useActiveImports } from "../hooks/useActiveImports";
import { importStatusLabel } from "./ImportStatusBadge";

export function ActiveImportBanner({ accountId }: { accountId: string }) {
  const jobs = useActiveImports(accountId);
  if (jobs.length === 0) {
    return null;
  }
  const job = jobs[0];
  return (
    <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-900">
      Import in progress: {job.file.fileName} · {importStatusLabel(job.status)}.{" "}
      <Link className="font-medium underline" to={CONTACT_PATHS.getJob(accountId, job.id)}>
        View progress
      </Link>
      {jobs.length > 1 ? (
        <>
          {" "}
          ·{" "}
          <Link className="underline" to={CONTACT_PATHS.getHistory(accountId)}>
            {jobs.length} active
          </Link>
        </>
      ) : null}
    </div>
  );
}
