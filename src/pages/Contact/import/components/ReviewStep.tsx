import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { DuplicatePolicy, DryRunDoc, ImportConfigDoc, ImportPreviewDoc } from "../types/import.schema";
import { formatBytes } from "../utils/file";
import type { MappingRow } from "../utils/mapping";

interface ReviewStepProps {
  fileName: string;
  fileSize?: number;
  preview: ImportPreviewDoc;
  mapping: MappingRow[];
  policy: DuplicatePolicy;
  defaultCountry: string;
  dryRun: DryRunDoc | null;
  config: ImportConfigDoc;
  consent: boolean;
  starting: boolean;
  onConsent: (value: boolean) => void;
  onBack: () => void;
  onStart: () => void;
}

export function ReviewStep({
  fileName,
  fileSize,
  preview,
  mapping,
  policy,
  defaultCountry,
  dryRun,
  config,
  consent,
  starting,
  onConsent,
  onBack,
  onStart,
}: ReviewStepProps) {
  const imported = mapping.filter((row) => row.target !== "ignore");
  const estimate =
    dryRun && dryRun.sampled > 0
      ? Math.round((dryRun.valid / dryRun.sampled) * preview.totalRows)
      : preview.totalRows;

  return (
    <section className="space-y-6" aria-labelledby="import-review-heading">
      <h1 id="import-review-heading" tabIndex={-1} className="text-xl font-semibold text-primary">
        Review and start
      </h1>

      <dl className="grid gap-3 rounded-2xl border p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">File</dt>
          <dd className="font-medium">
            {fileName}
            {fileSize ? ` · ${formatBytes(fileSize)}` : ""}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Rows</dt>
          <dd className="font-medium">{preview.totalRows.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Default country</dt>
          <dd className="font-medium">{defaultCountry}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Duplicates</dt>
          <dd className="font-medium capitalize">{policy}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">Mapped columns</dt>
          <dd className="font-medium">
            {imported.map((row) => `${row.source} → ${row.target}`).join(", ")}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">Sample estimate</dt>
          <dd>
            About {estimate.toLocaleString()} of {preview.totalRows.toLocaleString()} rows look valid in the
            sample.
            {dryRun ? ` ${dryRun.existingMatches.count} sampled identities already exist.` : ""}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">Plan capacity</dt>
          <dd>
            {preview.totalRows.toLocaleString()} contacts will be checked against your plan when you start.
            If you are over capacity, start returns a rate-limit error and nothing is imported.
          </dd>
        </div>
      </dl>

      <div className="space-y-3 rounded-2xl border p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="import-consent"
            checked={consent}
            onCheckedChange={(value) => onConsent(value === true)}
          />
          <Label htmlFor="import-consent" className="text-sm leading-6 font-normal">
            {config.consentText.text}
          </Label>
        </div>
        {!consent ? (
          <p className="text-sm text-amber-800">
            These contacts will be imported without marketing consent. Existing contacts keep their current
            consent and opt-out settings.
          </p>
        ) : null}
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onBack} disabled={starting}>
          Back to mapping
        </Button>
        <Button type="button" onClick={onStart} disabled={starting}>
          {starting ? "Starting…" : "Start import"}
        </Button>
      </div>
    </section>
  );
}
