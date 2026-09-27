import { describe, expect, it } from "vitest";
import { initialWizardState, stepFromJob, wizardReducer } from "../state/wizard.reducer";
import type { ImportJobDoc } from "../types/import.schema";

function job(status: ImportJobDoc["status"]): ImportJobDoc {
  return {
    id: "job-1",
    status,
    file: { fileName: "contacts.csv", mimeType: "text/csv", byteSize: 12, key: "k" },
    processed: 0,
    total: 10,
    percent: 0,
    totals: { processed: 0, inserted: 0, updated: 0, skipped: 0, failed: 0, duplicates: 0 },
    rowErrorPreview: [],
    timestamps: {},
    errorReportAvailable: false,
  };
}

describe("wizardReducer", () => {
  it("keeps upload until analyzing starts", () => {
    const next = wizardReducer(initialWizardState, { type: "JOB_SNAPSHOT", job: job("uploaded") });
    expect(next.step).toBe("upload");
  });

  it("moves to analyzing after ANALYZING or validating", () => {
    const analyzing = wizardReducer(initialWizardState, { type: "ANALYZING" });
    expect(analyzing.step).toBe("analyzing");
    const validating = wizardReducer(analyzing, { type: "JOB_SNAPSHOT", job: job("validating") });
    expect(validating.step).toBe("analyzing");
  });

  it("stays on review after mapping snapshots", () => {
    let state = wizardReducer(initialWizardState, { type: "JOB_SNAPSHOT", job: job("mapping") });
    state = wizardReducer(state, { type: "GO_REVIEW" });
    expect(state.step).toBe("review");
    state = wizardReducer(state, { type: "JOB_SNAPSHOT", job: job("mapping") });
    expect(state.step).toBe("review");
  });

  it("uses progress for processing and terminal statuses", () => {
    expect(stepFromJob(job("processing"), "mapping", false)).toBe("progress");
    expect(stepFromJob(job("completed_with_errors"), "mapping", false)).toBe("progress");
  });

  it("clears dry-run when mapping changes", () => {
    const withDry = wizardReducer(
      {
        ...initialWizardState,
        mapping: [{ source: "Phone", target: "phone", transform: "none", suggested: true }],
        dryRun: {
          sampled: 1,
          valid: 1,
          invalid: 0,
          byErrorCode: {},
          invalidSamples: [],
          validSamples: [],
          existingMatches: { count: 0, phones: [], emails: [] },
        },
      },
      { type: "SET_COUNTRY", country: "us" },
    );
    expect(withDry.defaultCountry).toBe("US");
    expect(withDry.dryRun).toBeNull();
    expect(withDry.countrySource).toBe("user");
  });
});
