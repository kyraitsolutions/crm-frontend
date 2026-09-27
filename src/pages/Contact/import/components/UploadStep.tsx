import { Button } from "@/components/ui/button";
import { formatImportError } from "../constants/import.errors";
import type { ImportConfigDoc } from "../types/import.schema";
import { formatBytes } from "../utils/file";

interface UploadStepProps {
  config: ImportConfigDoc;
  fileName: string | null;
  uploadPercent: number;
  uploading: boolean;
  analyzing: boolean;
  error?: string;
  onFile: (file: File) => void;
  onCancel: () => void;
}

export function UploadStep({
  config,
  fileName,
  uploadPercent,
  uploading,
  analyzing,
  error,
  onFile,
  onCancel,
}: UploadStepProps) {
  const accept = config.limits.allowedTypes.join(",");

  return (
    <section className="space-y-4" aria-labelledby="import-upload-heading">
      <h1 id="import-upload-heading" tabIndex={-1} className="text-xl font-semibold text-primary">
        Upload contacts
      </h1>
      <p className="text-sm text-muted-foreground">
        CSV or XLSX, up to {formatBytes(config.limits.maxFileBytes)} and {config.limits.maxRows.toLocaleString()}{" "}
        rows. Stay on this page until the file finishes uploading.
      </p>

      <label
        className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-muted/30 px-6 py-10 text-center hover:bg-muted/50"
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          if (uploading || analyzing) {
            return;
          }
          const file = event.dataTransfer.files?.[0];
          if (file) {
            onFile(file);
          }
        }}
      >
        <input
          type="file"
          accept={accept}
          className="sr-only"
          disabled={uploading || analyzing}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onFile(file);
            }
            event.target.value = "";
          }}
        />
        <span className="text-sm font-medium">Drop a file here or choose a file</span>
        <span className="mt-1 text-xs text-muted-foreground">{accept}</span>
        {fileName ? <span className="mt-3 text-sm text-primary">{fileName}</span> : null}
      </label>

      {(uploading || analyzing) && (
        <div className="space-y-2">
          <div
            className="h-2 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={analyzing ? undefined : uploadPercent}
            aria-label={analyzing ? "Analyzing file" : "Upload progress"}
          >
            <div
              className={`h-full bg-primary transition-[width] ${analyzing ? "w-2/3 animate-pulse" : ""}`}
              style={analyzing ? undefined : { width: `${uploadPercent}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {analyzing ? "Analyzing file…" : `Uploading ${uploadPercent}%`}
          </p>
          {uploading && !analyzing ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel upload
            </Button>
          ) : null}
        </div>
      )}

      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </section>
  );
}

export function uploadClientError(code: "IMPORT_UNSUPPORTED_TYPE" | "IMPORT_FILE_TOO_LARGE"): string {
  return formatImportError(code);
}
