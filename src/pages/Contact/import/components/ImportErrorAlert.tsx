import type { ApiError } from "@/types";
import { formatImportError, importErrorCopy } from "../constants/import.errors";

export function ImportErrorAlert({ error }: { error: ApiError | null | undefined }) {
  if (!error) {
    return null;
  }
  const copy = importErrorCopy(error.code, error.status, error.message);
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
      <p className="font-medium">{copy.message}</p>
      <p className="mt-1 text-red-800">{copy.action}</p>
    </div>
  );
}

export function importErrorText(error: ApiError): string {
  return formatImportError(error.code, error.status, error.message);
}
