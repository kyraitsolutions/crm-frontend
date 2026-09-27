import { z } from "zod";

export const ImportStatusSchema = z.enum([
  "uploaded",
  "scanning",
  "validating",
  "mapping",
  "queued",
  "processing",
  "paused",
  "completed",
  "completed_with_errors",
  "failed",
  "cancelled",
]);

export const DuplicatePolicySchema = z.enum(["skip", "update", "merge"]);
export const ImportTransformSchema = z.enum(["none", "trim", "lowercase"]);

export const ImportFieldMappingSchema = z.object({
  source: z.string(),
  target: z.string(),
  transform: ImportTransformSchema.optional(),
});

export const ImportCountersSchema = z.object({
  totalRows: z.number().optional(),
  processed: z.number().default(0),
  inserted: z.number().default(0),
  updated: z.number().default(0),
  skipped: z.number().default(0),
  failed: z.number().default(0),
  duplicates: z.number().default(0),
});

export const ImportRowErrorSchema = z.object({
  rowNumber: z.number(),
  reason: z.string(),
  column: z.string().nullish(),
  rawValue: z.string().nullish(),
  raw: z.array(z.string()).nullish(),
});

export const ImportJobDocSchema = z.object({
  id: z.string(),
  status: ImportStatusSchema,
  file: z.object({
    fileName: z.string(),
    mimeType: z.string(),
    byteSize: z.number(),
    key: z.string().optional(),
  }),
  processed: z.number().default(0),
  total: z.number().default(0),
  percent: z.number().default(0),
  totals: ImportCountersSchema,
  rowErrorPreview: z.array(ImportRowErrorSchema).optional().default([]),
  timestamps: z.object({
    createdAt: z.union([z.string(), z.date()]).optional(),
    updatedAt: z.union([z.string(), z.date()]).optional(),
    startedAt: z.union([z.string(), z.date()]).optional().nullable(),
    completedAt: z.union([z.string(), z.date()]).optional().nullable(),
  }),
  errorReportAvailable: z.boolean().optional().default(false),
  defaultCountry: z.string().optional(),
  consentAttested: z.boolean().optional(),
  errorMessage: z.string().optional(),
});

export const ImportCreateDocSchema = z.object({
  id: z.string(),
  status: z.literal("uploaded"),
  key: z.string(),
  expiresInSec: z.number().optional(),
  maxBytes: z.number().optional(),
  uploadUrl: z.string().optional(),
  upload: z
    .object({
      url: z.string(),
      fields: z.record(z.string(), z.string()),
      key: z.string(),
      expiresInSec: z.number(),
      maxBytes: z.number(),
      conditions: z.array(z.unknown()).optional(),
    })
    .optional(),
});

export const ImportConfigDocSchema = z.object({
  limits: z.object({
    maxFileBytes: z.number(),
    maxRows: z.number(),
    allowedTypes: z.array(z.string()),
    allowedMimeTypes: z.array(z.string()).optional(),
    sheetSupport: z
      .object({
        csv: z.boolean(),
        xlsx: z.boolean(),
        firstVisibleSheet: z.boolean().optional(),
      })
      .optional(),
  }),
  fields: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      type: z.string(),
      allowedTransforms: z.array(z.string()),
      identityKey: z.boolean(),
    }),
  ),
  policies: z.array(
    z.object({
      key: DuplicatePolicySchema,
      description: z.string(),
    }),
  ),
  merge: z.object({
    emptyOnly: z.array(z.string()),
    tags: z.array(z.string()),
    allowStatusUpgrade: z.boolean(),
  }),
  consentText: z.object({
    version: z.string(),
    text: z.string(),
  }),
  defaultCountry: z.object({
    code: z.string().nullable(),
    source: z.enum(["organization", "none"]),
  }),
});

export const ImportPreviewDocSchema = z.object({
  headers: z.array(z.string()),
  sampleRows: z.array(z.array(z.string())),
  totalRows: z.number(),
  sheetNames: z.array(z.string()).optional(),
  detected: z
    .object({
      kind: z.enum(["csv", "xlsx"]).optional(),
      encoding: z.string().optional(),
      delimiter: z.string().optional(),
    })
    .optional(),
  suggestedMapping: z.array(ImportFieldMappingSchema),
});

export const DryRunRowSchema = z.object({
  rowNumber: z.number(),
  raw: z.array(z.string()),
  normalized: z.record(z.string(), z.unknown()),
  errors: z
    .array(
      z.object({
        code: z.string(),
        column: z.string().optional(),
        rawValue: z.string().optional(),
      }),
    )
    .optional(),
});

export const DryRunDocSchema = z.object({
  sampled: z.number(),
  valid: z.number(),
  invalid: z.number(),
  byErrorCode: z.record(z.string(), z.number()),
  invalidSamples: z.array(DryRunRowSchema),
  validSamples: z.array(DryRunRowSchema),
  existingMatches: z.object({
    count: z.number(),
    phones: z.array(z.string()),
    emails: z.array(z.string()),
  }),
});

export const ImportErrorDownloadDocSchema = z.object({
  url: z.string(),
  expiresInSec: z.number(),
});

export const ImportListResultSchema = z.object({
  docs: z.array(ImportJobDocSchema),
  nextCursor: z.string().optional().nullable(),
});

export type ImportStatus = z.infer<typeof ImportStatusSchema>;
export type DuplicatePolicy = z.infer<typeof DuplicatePolicySchema>;
export type ImportTransform = z.infer<typeof ImportTransformSchema>;
export type ImportFieldMapping = z.infer<typeof ImportFieldMappingSchema>;
export type ImportJobDoc = z.infer<typeof ImportJobDocSchema>;
export type ImportCreateDoc = z.infer<typeof ImportCreateDocSchema>;
export type ImportConfigDoc = z.infer<typeof ImportConfigDocSchema>;
export type ImportPreviewDoc = z.infer<typeof ImportPreviewDocSchema>;
export type DryRunDoc = z.infer<typeof DryRunDocSchema>;
export type ImportErrorDownloadDoc = z.infer<typeof ImportErrorDownloadDocSchema>;
export type ImportListResult = z.infer<typeof ImportListResultSchema>;
