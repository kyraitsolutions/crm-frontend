import { describe, expect, it } from "vitest";
import { isLocalDownloadUrl, isLocalUploadUrl } from "../services/presigned-upload";

describe("local store URL schemes", () => {
  it("detects the local store scheme", () => {
    expect(isLocalUploadUrl("local-upload://uploads/org/acc/job/source.csv")).toBe(true);
    expect(isLocalUploadUrl("https://bucket.s3.amazonaws.com/")).toBe(false);
    expect(isLocalDownloadUrl("local-download://reports/job/errors.csv?filename=x.csv")).toBe(true);
    expect(isLocalDownloadUrl("https://bucket.s3.amazonaws.com/errors.csv")).toBe(false);
  });
});
