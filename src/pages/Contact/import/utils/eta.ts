export function smoothRate(
  previous: number | null,
  next: number,
  alpha = 0.35,
): number {
  if (!Number.isFinite(next) || next < 0) {
    return previous ?? 0;
  }
  if (previous === null || !Number.isFinite(previous)) {
    return next;
  }
  return previous * (1 - alpha) + next * alpha;
}

export function instantRate(
  previousProcessed: number,
  nextProcessed: number,
  elapsedMs: number,
): number {
  if (elapsedMs <= 0) {
    return 0;
  }
  const delta = Math.max(0, nextProcessed - previousProcessed);
  return (delta * 1000) / elapsedMs;
}

export function etaSeconds(remaining: number, rowsPerSec: number): number | null {
  if (!Number.isFinite(remaining) || remaining <= 0) {
    return 0;
  }
  if (!Number.isFinite(rowsPerSec) || rowsPerSec <= 0.05) {
    return null;
  }
  return Math.ceil(remaining / rowsPerSec);
}

export function formatEta(seconds: number | null): string {
  if (seconds === null) {
    return "Calculating…";
  }
  if (seconds <= 0) {
    return "Almost done";
  }
  if (seconds < 60) {
    return `${seconds}s remaining`;
  }
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes < 60) {
    return rest === 0 ? `${minutes}m remaining` : `${minutes}m ${rest}s remaining`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m remaining`;
}

export function formatRowsPerSec(rate: number): string {
  if (!Number.isFinite(rate) || rate <= 0) {
    return "0 rows/sec";
  }
  if (rate < 10) {
    return `${rate.toFixed(1)} rows/sec`;
  }
  return `${Math.round(rate)} rows/sec`;
}
