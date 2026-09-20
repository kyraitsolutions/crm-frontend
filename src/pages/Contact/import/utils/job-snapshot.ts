import { isTerminalImportStatus } from "../constants/import.constant";
import {
  ImportCountersSchema,
  ImportJobDocSchema,
  ImportStatusSchema,
  type ImportJobDoc,
} from "../types/import.schema";
import { z } from "zod";

export const ImportJobSseSnapshotSchema = z.object({
  id: z.string(),
  status: ImportStatusSchema.optional(),
  counters: ImportCountersSchema.optional(),
  totals: ImportCountersSchema.optional(),
  processed: z.number().optional(),
  total: z.number().optional(),
  totalRows: z.number().optional(),
  percent: z.number().optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
  errorMessage: z.string().optional(),
  errorReportAvailable: z.boolean().optional(),
});

export type ImportJobSseSnapshot = z.infer<typeof ImportJobSseSnapshotSchema>;

export function parseJobSnapshot(raw: unknown): ImportJobDoc | null {
  const full = ImportJobDocSchema.safeParse(raw);
  return full.success ? full.data : null;
}

export function parseSseSnapshot(raw: unknown): ImportJobSseSnapshot | null {
  const parsed = ImportJobSseSnapshotSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export function mergeJobSnapshot(
  current: ImportJobDoc | null,
  patch: ImportJobSseSnapshot,
): ImportJobDoc | null {
  if (!current) {
    return null;
  }
  if (current.id !== patch.id) {
    return current;
  }
  const totals = {
    ...current.totals,
    ...(patch.totals ?? patch.counters ?? {}),
  };
  const processed = patch.processed ?? totals.processed ?? current.processed;
  const total = patch.total ?? patch.totalRows ?? totals.totalRows ?? current.total;
  const percent =
    patch.percent ??
    (total > 0 ? Math.min(100, Math.round((processed / total) * 100)) : current.percent);
  return {
    ...current,
    status: patch.status ?? current.status,
    processed,
    total,
    percent,
    totals,
    errorMessage: patch.errorMessage ?? current.errorMessage,
    errorReportAvailable: patch.errorReportAvailable ?? current.errorReportAvailable,
    timestamps: {
      ...current.timestamps,
      updatedAt: patch.updatedAt ?? current.timestamps.updatedAt,
    },
  };
}

export function becameTerminal(previous: ImportJobDoc | null, next: ImportJobDoc): boolean {
  return isTerminalImportStatus(next.status) && (!previous || !isTerminalImportStatus(previous.status));
}
