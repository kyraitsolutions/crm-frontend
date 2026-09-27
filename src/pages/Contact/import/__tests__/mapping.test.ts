import { describe, expect, it } from "vitest";
import type { ImportConfigDoc, ImportPreviewDoc } from "../types/import.schema";
import { canContinueMapping, hasIdentityMapping, mappingFromPreview } from "../utils/mapping";

const config: ImportConfigDoc = {
  limits: { maxFileBytes: 1000, maxRows: 10, allowedTypes: [".csv"] },
  fields: [
    { key: "name", label: "Name", type: "string", allowedTransforms: ["none", "trim"], identityKey: false },
    { key: "phone", label: "Phone", type: "string", allowedTransforms: ["none", "trim"], identityKey: true },
    { key: "email", label: "Email", type: "string", allowedTransforms: ["none", "lowercase"], identityKey: true },
    { key: "ignore", label: "Ignore", type: "none", allowedTransforms: ["none"], identityKey: false },
  ],
  policies: [{ key: "update", description: "Overwrite" }],
  merge: { emptyOnly: ["name"], tags: ["union"], allowStatusUpgrade: false },
  consentText: { version: "v1", text: "I confirm" },
  defaultCountry: { code: null, source: "none" },
};

const preview: ImportPreviewDoc = {
  headers: ["Name", "Mobile"],
  sampleRows: [["Ada", "9876543210"]],
  totalRows: 1,
  suggestedMapping: [
    { source: "Name", target: "name" },
    { source: "Mobile", target: "phone" },
  ],
};

describe("mapping validation", () => {
  it("prefills suggested identity columns", () => {
    const rows = mappingFromPreview(preview, config);
    expect(hasIdentityMapping(rows)).toBe(true);
    expect(rows.find((row) => row.source === "Mobile")?.suggested).toBe(true);
  });

  it("blocks continue without identity or country, and does not treat a bad sample as a hard stop", () => {
    const ignored = mappingFromPreview(preview, config).map((row) => ({ ...row, target: "ignore" }));
    expect(canContinueMapping({ rows: ignored, defaultCountry: "IN" }).reason).toBe("identity");
    const mapped = mappingFromPreview(preview, config);
    expect(canContinueMapping({ rows: mapped, defaultCountry: "" }).reason).toBe("country");
    expect(canContinueMapping({ rows: mapped, defaultCountry: "IN", sampled: 6, valid: 0 }).ok).toBe(true);
  });

  it("does not keep Status mapped when sample values are not import statuses", () => {
    const withStatus: ImportPreviewDoc = {
      ...preview,
      headers: ["Name", "Mobile", "Status"],
      sampleRows: [["Ada", "9876543210", "lead"]],
      suggestedMapping: [
        { source: "Name", target: "name" },
        { source: "Mobile", target: "phone" },
        { source: "Status", target: "status" },
      ],
    };
    const rows = mappingFromPreview(withStatus, config);
    expect(rows.find((row) => row.source === "Status")?.target).toBe("ignore");
  });
});
