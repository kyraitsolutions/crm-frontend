import { useEffect, useState } from "react";
import { isActiveImportStatus } from "../constants/import.constant";
import { contactImportService } from "../services/contact-import.service";
import type { ImportJobDoc } from "../types/import.schema";

const ACTIVE_POLL_MS = 15_000;

export function useActiveImports(accountId: string | undefined) {
  const [jobs, setJobs] = useState<ImportJobDoc[]>([]);

  useEffect(() => {
    if (!accountId) {
      return;
    }
    let cancelled = false;
    let timeout: number | undefined;

    const tick = async () => {
      try {
        const page = await contactImportService.list(accountId, { limit: 20 });
        if (cancelled) {
          return;
        }
        const active = page.docs.filter((job) => isActiveImportStatus(job.status));
        setJobs(active);
        if (timeout !== undefined) {
          window.clearTimeout(timeout);
          timeout = undefined;
        }
        if (active.length > 0) {
          timeout = window.setTimeout(() => void tick(), ACTIVE_POLL_MS);
        }
      } catch {
        if (!cancelled) {
          setJobs([]);
        }
      }
    };

    void tick();
    const onFocus = () => {
      void tick();
    };
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      if (timeout !== undefined) {
        window.clearTimeout(timeout);
      }
      window.removeEventListener("focus", onFocus);
    };
  }, [accountId]);

  return jobs;
}
