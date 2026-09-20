import type { ImportStatus } from "../types/import.schema";

export const IMPORT_IDEMPOTENCY_PREFIX = "contact-import-idempotency";

export const IMPORT_ACTIVE_STATUSES: readonly ImportStatus[] = [
  "uploaded",
  "scanning",
  "validating",
  "mapping",
  "queued",
  "processing",
  "paused",
] as const;

export const IMPORT_TERMINAL_STATUSES: readonly ImportStatus[] = [
  "completed",
  "completed_with_errors",
  "failed",
  "cancelled",
] as const;

export const IMPORT_SSE_MAX_FAILURES = 3;
export const IMPORT_POLL_MS = 3000;
export const IMPORT_UI_THROTTLE_MS = 1000;
export const IMPORT_DRY_RUN_DEBOUNCE_MS = 800;
export const IMPORT_SAMPLE_SIZE = 200;

export function idempotencyStorageKey(accountId: string): string {
  return `${IMPORT_IDEMPOTENCY_PREFIX}:${accountId}`;
}

export function isActiveImportStatus(status: ImportStatus): boolean {
  return IMPORT_ACTIVE_STATUSES.includes(status);
}

export function isTerminalImportStatus(status: ImportStatus): boolean {
  return IMPORT_TERMINAL_STATUSES.includes(status);
}
