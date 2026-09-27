import type { ApiError } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { contactImportService } from "../services/contact-import.service";
import type { ImportJobDoc, ImportStatus } from "../types/import.schema";

export function useImportHistory(accountId: string | undefined, status: ImportStatus | "") {
  const [docs, setDocs] = useState<ImportJobDoc[]>([]);
  const [cursor, setCursor] = useState<string | undefined>();
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(
    async (nextCursor?: string) => {
      if (!accountId) {
        return;
      }
      const appending = Boolean(nextCursor);
      if (appending) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      try {
        const page = await contactImportService.list(accountId, {
          status: status || undefined,
          cursor: nextCursor,
          limit: 20,
        });
        setDocs((prev) => (appending ? [...prev, ...page.docs] : page.docs));
        setCursor(page.nextCursor ?? undefined);
        setError(null);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [accountId, status],
  );

  useEffect(() => {
    void load();
  }, [load]);

  return {
    docs,
    error,
    loading,
    loadingMore,
    hasMore: Boolean(cursor),
    loadMore: () => load(cursor),
    reload: () => load(),
  };
}
