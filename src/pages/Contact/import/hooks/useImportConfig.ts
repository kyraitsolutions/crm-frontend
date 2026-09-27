import type { ApiError } from "@/types";
import { useEffect, useState } from "react";
import { contactImportService } from "../services/contact-import.service";
import type { ImportConfigDoc } from "../types/import.schema";

export function useImportConfig(accountId: string | undefined) {
  const [config, setConfig] = useState<ImportConfigDoc | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accountId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    contactImportService
      .getConfig(accountId)
      .then((next) => {
        if (!cancelled) {
          setConfig(next);
          setError(null);
        }
      })
      .catch((err: ApiError) => {
        if (!cancelled) {
          setError(err);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [accountId]);

  return { config, error, loading };
}
