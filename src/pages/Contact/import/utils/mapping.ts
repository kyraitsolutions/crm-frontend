import type {
  DuplicatePolicy,
  ImportConfigDoc,
  ImportFieldMapping,
  ImportPreviewDoc,
  ImportTransform,
} from "../types/import.schema";

export interface MappingRow {
  source: string;
  target: string;
  transform: ImportTransform;
  suggested: boolean;
}

const IDENTITY_TARGETS = new Set(["phone", "email"]);

export function defaultTransformForTarget(
  target: string,
  config: ImportConfigDoc,
): ImportTransform {
  const field = config.fields.find((item) => item.key === target);
  const allowed = new Set(field?.allowedTransforms ?? ["none"]);
  if (target === "email" && allowed.has("lowercase")) {
    return "lowercase";
  }
  if ((target === "name" || target === "phone") && allowed.has("trim")) {
    return "trim";
  }
  if (allowed.has("none")) {
    return "none";
  }
  return (field?.allowedTransforms[0] as ImportTransform | undefined) ?? "none";
}

const ALLOWED_STATUS_VALUES = new Set(["subscribed", "unsubscribed", "bounced"]);

export function samplesLookLikeImportStatus(preview: ImportPreviewDoc, columnIndex: number): boolean {
  const values = preview.sampleRows
    .map((row) => (row[columnIndex] ?? "").trim().toLowerCase())
    .filter((value) => value.length > 0);
  if (values.length === 0) {
    return false;
  }
  return values.every((value) => ALLOWED_STATUS_VALUES.has(value));
}

export function mappingFromPreview(
  preview: ImportPreviewDoc,
  config: ImportConfigDoc,
): MappingRow[] {
  const suggested = new Map(preview.suggestedMapping.map((row) => [row.source, row.target]));
  return preview.headers.map((source, index) => {
    let target = suggested.get(source) ?? "ignore";
    if (target === "status" && !samplesLookLikeImportStatus(preview, index)) {
      target = "ignore";
    }
    return {
      source,
      target,
      transform: defaultTransformForTarget(target, config),
      suggested: target !== "ignore",
    };
  });
}

export function toStartMapping(rows: MappingRow[]): ImportFieldMapping[] {
  return rows.map((row) => ({
    source: row.source,
    target: row.target,
    transform: row.transform,
  }));
}

export function identityKeysFromMapping(rows: MappingRow[]): Array<"phone" | "email"> {
  const keys: Array<"phone" | "email"> = [];
  if (rows.some((row) => row.target === "phone")) {
    keys.push("phone");
  }
  if (rows.some((row) => row.target === "email")) {
    keys.push("email");
  }
  return keys;
}

export function hasIdentityMapping(rows: MappingRow[]): boolean {
  return rows.some((row) => IDENTITY_TARGETS.has(row.target));
}

export function isIsoCountry(value: string): boolean {
  return /^[A-Za-z]{2}$/.test(value);
}

export function canContinueMapping(input: {
  rows: MappingRow[];
  defaultCountry: string;
  sampled?: number;
  valid?: number;
}): { ok: boolean; reason?: "identity" | "country" } {
  if (!hasIdentityMapping(input.rows)) {
    return { ok: false, reason: "identity" };
  }
  if (!isIsoCountry(input.defaultCountry)) {
    return { ok: false, reason: "country" };
  }
  return { ok: true };
}

export function sampleValues(preview: ImportPreviewDoc, columnIndex: number, limit = 3): string[] {
  return preview.sampleRows
    .slice(0, limit)
    .map((row) => row[columnIndex] ?? "")
    .filter((value) => value.length > 0);
}

export function policyDescription(
  config: ImportConfigDoc,
  policy: DuplicatePolicy,
): string {
  return config.policies.find((item) => item.key === policy)?.description ?? "";
}
