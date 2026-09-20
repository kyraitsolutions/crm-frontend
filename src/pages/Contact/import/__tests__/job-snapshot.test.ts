import { describe, expect, it } from "vitest";
import { becameTerminal, mergeJobSnapshot, parseJobSnapshot, parseSseSnapshot } from "../utils/job-snapshot";
import { jobFixture } from "./fixtures";

describe("job snapshot merge", () => {
  it("accepts a full GET-shaped document", () => {
    const job = jobFixture({ processed: 4, total: 10, percent: 40 });
    expect(parseJobSnapshot(job)?.processed).toBe(4);
  });

  it("merges the slimmer SSE payload into the last GET snapshot", () => {
    const current = jobFixture({ status: "processing", processed: 1, total: 10, percent: 10 });
    const patch = parseSseSnapshot({
      id: "job-1",
      status: "processing",
      counters: { processed: 6, inserted: 5, updated: 1, skipped: 0, failed: 0, duplicates: 0 },
      totalRows: 10,
      updatedAt: "2026-01-01T00:01:00.000Z",
    });
    expect(patch).not.toBeNull();
    const merged = mergeJobSnapshot(current, patch!);
    expect(merged?.processed).toBe(6);
    expect(merged?.totals.inserted).toBe(5);
    expect(merged?.percent).toBe(60);
    expect(merged?.file.fileName).toBe("contacts.csv");
  });

  it("accepts a completed job with null error columns from the API", () => {
    const parsed = parseJobSnapshot({
      id: "6aae88e7ac9a82a241670254",
      status: "completed_with_errors",
      file: {
        fileName: "export (10).csv",
        mimeType: "text/csv",
        byteSize: 4121,
        key: "uploads/source.csv",
      },
      processed: 14,
      total: 14,
      percent: 100,
      totals: {
        totalRows: 14,
        processed: 14,
        inserted: 0,
        updated: 1,
        skipped: 12,
        failed: 1,
        duplicates: 0,
      },
      rowErrorPreview: [
        {
          rowNumber: 14,
          reason: "INVALID_IDENTITY",
          column: null,
          rawValue: null,
          raw: ["Abhijeet", "", "+919528295631"],
        },
      ],
      timestamps: {
        createdAt: "2026-09-19T13:06:47.889Z",
        updatedAt: "2026-09-19T13:08:24.281Z",
        startedAt: "2026-09-19T13:08:21.233Z",
        completedAt: "2026-09-19T13:08:24.143Z",
      },
      errorReportAvailable: true,
      defaultCountry: "IN",
      consentAttested: true,
    });
    expect(parsed?.totals.skipped).toBe(12);
    expect(parsed?.rowErrorPreview[0]?.reason).toBe("INVALID_IDENTITY");
  });

  it("detects the transition into a terminal status", () => {
    const previous = jobFixture({ status: "processing" });
    const next = jobFixture({ status: "completed_with_errors" });
    expect(becameTerminal(previous, next)).toBe(true);
    expect(becameTerminal(next, next)).toBe(false);
  });
});
