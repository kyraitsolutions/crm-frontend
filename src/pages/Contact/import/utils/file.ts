import type { ImportConfigDoc } from "../types/import.schema";

export function fileExtension(fileName: string): string {
  const idx = fileName.lastIndexOf(".");
  if (idx < 0) {
    return "";
  }
  return fileName.slice(idx).toLowerCase();
}

export function contentTypeForFile(file: File): string {
  if (file.type) {
    return file.type;
  }
  return fileExtension(file.name) === ".xlsx"
    ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    : "text/csv";
}

export function validateImportFile(
  file: File,
  config: ImportConfigDoc,
): { ok: true } | { ok: false; code: "IMPORT_UNSUPPORTED_TYPE" | "IMPORT_FILE_TOO_LARGE" } {
  const ext = fileExtension(file.name);
  const allowed = config.limits.allowedTypes.map((type) => type.toLowerCase());
  if (!allowed.includes(ext)) {
    return { ok: false, code: "IMPORT_UNSUPPORTED_TYPE" };
  }
  if (file.size > config.limits.maxFileBytes) {
    return { ok: false, code: "IMPORT_FILE_TOO_LARGE" };
  }
  return { ok: true };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
