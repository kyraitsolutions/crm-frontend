import { AlertTriangle } from "lucide-react";

interface PermissionWarningProps {
  message?: string | null;
}

export function PermissionWarning({ message }: PermissionWarningProps) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
