import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import type { ApiError } from "@/types";
import { ImportErrorAlert } from "./ImportErrorAlert";
import { importErrorCopy } from "../constants/import.errors";
import type {
  DuplicatePolicy,
  DryRunDoc,
  ImportConfigDoc,
  ImportPreviewDoc,
  ImportTransform,
} from "../types/import.schema";
import { canContinueMapping, sampleValues, type MappingRow } from "../utils/mapping";

interface MappingStepProps {
  config: ImportConfigDoc;
  preview: ImportPreviewDoc;
  mapping: MappingRow[];
  policy: DuplicatePolicy;
  defaultCountry: string;
  dryRun: DryRunDoc | null;
  dryRunLoading: boolean;
  dryRunError?: ApiError | null;
  onTarget: (source: string, target: string) => void;
  onTransform: (source: string, transform: ImportTransform) => void;
  onPolicy: (policy: DuplicatePolicy) => void;
  onCountry: (country: string) => void;
  onContinue: () => void;
}

export function MappingStep({
  config,
  preview,
  mapping,
  policy,
  defaultCountry,
  dryRun,
  dryRunLoading,
  dryRunError,
  onTarget,
  onTransform,
  onPolicy,
  onCountry,
  onContinue,
}: MappingStepProps) {
  const gate = canContinueMapping({
    rows: mapping,
    defaultCountry,
  });
  const statusSources = mapping.filter((row) => row.target === "status");
  const statusErrors = dryRun?.byErrorCode.INVALID_STATUS ?? 0;
  const allInvalid = Boolean(dryRun && dryRun.sampled > 0 && dryRun.valid === 0);

  return (
    <section className="space-y-6" aria-labelledby="import-mapping-heading">
      <div>
        <h1 id="import-mapping-heading" tabIndex={-1} className="text-xl font-semibold text-primary">
          Map columns
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {preview.totalRows.toLocaleString()} rows detected. Map at least a phone or email column. Default
          country is required and is never assumed.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-muted text-left text-muted-foreground">
            <tr>
              <th className="p-3 font-medium">Source column</th>
              <th className="p-3 font-medium">Sample values</th>
              <th className="p-3 font-medium">Maps to</th>
              <th className="p-3 font-medium">Transform</th>
            </tr>
          </thead>
          <tbody>
            {mapping.map((row, index) => {
              const field = config.fields.find((item) => item.key === row.target);
              const transforms = (field?.allowedTransforms ?? ["none"]) as ImportTransform[];
              return (
                <tr key={row.source} className="even:bg-muted/40">
                  <td className="p-3 font-medium">
                    {row.source}
                    {row.suggested ? (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">Suggested match</span>
                    ) : (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">Not mapped</span>
                    )}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {sampleValues(preview, index).join(" · ") || "—"}
                  </td>
                  <td className="p-3">
                    <Label htmlFor={`map-target-${index}`} className="sr-only">
                      Map {row.source} to
                    </Label>
                    <Select value={row.target} onValueChange={(value) => onTarget(row.source, value)}>
                      <SelectTrigger id={`map-target-${index}`} className="w-52">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ignore">Don't import</SelectItem>
                        {config.fields
                          .filter((item) => item.key !== "ignore")
                          .map((item) => (
                            <SelectItem key={item.key} value={item.key}>
                              {item.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <Label htmlFor={`map-transform-${index}`} className="sr-only">
                      Transform {row.source}
                    </Label>
                    <Select
                      value={row.transform}
                      disabled={row.target === "ignore"}
                      onValueChange={(value) => onTransform(row.source, value as ImportTransform)}
                    >
                      <SelectTrigger id={`map-transform-${index}`} className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {transforms.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">If a contact already exists</legend>
        <RadioGroup
          value={policy}
          onValueChange={(value) => onPolicy(value as DuplicatePolicy)}
          className="gap-3"
        >
          {config.policies.map((item) => (
            <label
              key={item.key}
              className="flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2"
            >
              <RadioGroupItem value={item.key} id={`policy-${item.key}`} className="mt-1" />
              <span>
                <span className="block text-sm font-medium capitalize">{item.key}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </span>
            </label>
          ))}
        </RadioGroup>
      </fieldset>

      <div className="max-w-xs space-y-2">
        <Label htmlFor="import-default-country">Default country (required)</Label>
        <Select value={defaultCountry || undefined} onValueChange={onCountry}>
          <SelectTrigger id="import-default-country" className="w-full">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {getCountries().map((country) => (
              <SelectItem key={country} value={country}>
                {country} (+{getCountryCallingCode(country)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Used to read national phone numbers. Not filled in unless your organization already has a country.
        </p>
      </div>

      {statusSources.length > 0 || statusErrors > 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p>
            Contact status only accepts <span className="font-medium">subscribed</span>,{" "}
            <span className="font-medium">unsubscribed</span>, or{" "}
            <span className="font-medium">bounced</span>. Values like{" "}
            <span className="font-medium">open</span> or lead are ignored — they do not fail the row.
          </p>
          {statusSources.length > 0 ? (
            <Button
              type="button"
              variant="outline"
              className="mt-3"
              onClick={() => {
                for (const row of statusSources) {
                  onTarget(row.source, "ignore");
                }
              }}
            >
              Don’t import Status
            </Button>
          ) : null}
        </div>
      ) : null}

      <ImportErrorAlert error={dryRunError} />
      <DryRunPanel dryRun={dryRun} loading={dryRunLoading} />

      {!gate.ok ? (
        <p className="text-sm text-amber-800" role="status">
          {gate.reason === "identity"
            ? "Map at least one phone or email column to continue."
            : "Choose a default country to continue."}
        </p>
      ) : null}
      {gate.ok && allInvalid ? (
        <p className="text-sm text-amber-800" role="status">
          Every sampled row is invalid. Fix mapping or country before starting. You can still continue
          after you set Status to Don’t import and pick a country.
        </p>
      ) : null}

      <Button type="button" disabled={!gate.ok || dryRunLoading} onClick={onContinue}>
        Continue to review
      </Button>
    </section>
  );
}

function DryRunPanel({ dryRun, loading }: { dryRun: DryRunDoc | null; loading: boolean }) {
  if (loading && !dryRun) {
    return <p className="text-sm text-muted-foreground">Checking a sample of rows…</p>;
  }
  if (!dryRun) {
    return null;
  }
  const topErrors = Object.entries(dryRun.byErrorCode).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const phoneExamples = dryRun.validSamples
    .map((row) => {
      const rawIndex = row.raw.findIndex((cell) => cell && /\d/.test(cell));
      const raw = rawIndex >= 0 ? row.raw[rawIndex] : "";
      const normalized = typeof row.normalized.phone === "string" ? row.normalized.phone : "";
      return raw && normalized && raw !== normalized ? { raw, normalized } : null;
    })
    .filter((item): item is { raw: string; normalized: string } => Boolean(item))
    .slice(0, 3);

  return (
    <div className="space-y-3 rounded-2xl border p-4" aria-live="polite">
      <p className="text-sm font-medium">
        Sample: {dryRun.valid} valid, {dryRun.invalid} invalid of {dryRun.sampled} rows
      </p>
      {topErrors.length > 0 ? (
        <ul className="text-sm text-muted-foreground">
          {topErrors.map(([code, count]) => (
            <li key={code}>
              {importErrorCopy(code).message} ({count})
            </li>
          ))}
        </ul>
      ) : null}
      {dryRun.existingMatches.count > 0 ? (
        <p className="text-sm">
          {dryRun.existingMatches.count} of these identities already exist in this account.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">No existing matches in this sample.</p>
      )}
      {phoneExamples.length > 0 ? (
        <div>
          <p className="text-xs font-medium text-muted-foreground">Phone normalization</p>
          <ul className="text-sm">
            {phoneExamples.map((item) => (
              <li key={item.normalized}>
                {item.raw} → {item.normalized}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {dryRun.invalidSamples.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-1 pr-3">Row</th>
                <th className="py-1 pr-3">Reason</th>
                <th className="py-1">Values</th>
              </tr>
            </thead>
            <tbody>
              {dryRun.invalidSamples.slice(0, 8).map((row) => (
                <tr key={row.rowNumber}>
                  <td className="py-1 pr-3">{row.rowNumber}</td>
                  <td className="py-1 pr-3">
                    {row.errors?.map((item) => importErrorCopy(item.code).message).join(" ")}
                  </td>
                  <td className="py-1">{row.raw.join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
