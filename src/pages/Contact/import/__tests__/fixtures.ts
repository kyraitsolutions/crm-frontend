import type {
  DryRunDoc,
  ImportConfigDoc,
  ImportJobDoc,
  ImportPreviewDoc,
} from "../types/import.schema";

export const importConfigFixture: ImportConfigDoc = {
  limits: {
    maxFileBytes: 1024 * 1024,
    maxRows: 500,
    allowedTypes: [".csv", ".xlsx"],
    allowedMimeTypes: ["text/csv"],
    sheetSupport: { csv: false, xlsx: true },
  },
  fields: [
    { key: "name", label: "Name", type: "string", allowedTransforms: ["none", "trim"], identityKey: false },
    { key: "phone", label: "Phone", type: "string", allowedTransforms: ["none", "trim"], identityKey: true },
    { key: "email", label: "Email", type: "string", allowedTransforms: ["none", "lowercase"], identityKey: true },
    { key: "ignore", label: "Ignore", type: "none", allowedTransforms: ["none"], identityKey: false },
  ],
  policies: [
    { key: "skip", description: "Leave the existing contact unchanged when a match is found." },
    { key: "update", description: "Overwrite mapped fields on the existing contact." },
    { key: "merge", description: "Fill empty mapped fields only." },
  ],
  merge: { emptyOnly: ["name", "email", "phone", "tags"], tags: ["union", "replace"], allowStatusUpgrade: false },
  consentText: {
    version: "import-consent-v1",
    text: "I confirm these contacts consented to receive marketing messages.",
  },
  defaultCountry: { code: null, source: "none" },
};

export function jobFixture(overrides: Partial<ImportJobDoc> = {}): ImportJobDoc {
  return {
    id: "job-1",
    status: "mapping",
    file: { fileName: "contacts.csv", mimeType: "text/csv", byteSize: 80, key: "uploads/x.csv" },
    processed: 0,
    total: 2,
    percent: 0,
    totals: { processed: 0, inserted: 0, updated: 0, skipped: 0, failed: 0, duplicates: 0 },
    rowErrorPreview: [],
    timestamps: { createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
    errorReportAvailable: false,
    ...overrides,
  };
}

export const previewFixture: ImportPreviewDoc = {
  headers: ["name", "phone", "email"],
  sampleRows: [
    ["Ada", "9876543210", "ada@kyra.test"],
    ["Bad", "123", "nope"],
  ],
  totalRows: 2,
  suggestedMapping: [
    { source: "name", target: "name" },
    { source: "phone", target: "phone" },
    { source: "email", target: "email" },
  ],
};

export const dryRunFixture: DryRunDoc = {
  sampled: 2,
  valid: 1,
  invalid: 1,
  byErrorCode: { INVALID_PHONE: 1 },
  invalidSamples: [
    {
      rowNumber: 2,
      raw: ["Bad", "123", "nope"],
      normalized: { phone: "123" },
      errors: [{ code: "INVALID_PHONE", column: "phone", rawValue: "123" }],
    },
  ],
  validSamples: [
    {
      rowNumber: 1,
      raw: ["Ada", "9876543210", "ada@kyra.test"],
      normalized: { name: "Ada", phone: "+919876543210", email: "ada@kyra.test" },
    },
  ],
  existingMatches: { count: 0, phones: [], emails: [] },
};

export function apiDoc<T>(doc: T, status = 200) {
  return {
    success: true,
    responseStatusCode: status,
    responseMessage: "ok",
    result: { doc },
  };
}

export function apiDocs<T>(docs: T[], nextCursor?: string) {
  return {
    success: true,
    responseStatusCode: 200,
    responseMessage: "ok",
    result: { docs, nextCursor },
  };
}
