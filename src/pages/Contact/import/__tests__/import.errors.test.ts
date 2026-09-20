import { describe, expect, it } from "vitest";
import { formatImportError, importErrorCopy, knownImportErrorCodes } from "../constants/import.errors";

describe("import error mapping", () => {
  it("never returns a raw code alone", () => {
    for (const code of knownImportErrorCodes()) {
      const copy = importErrorCopy(code);
      expect(copy.message).not.toBe(code);
      expect(copy.action.length).toBeGreaterThan(3);
      expect(formatImportError(code)).not.toBe(code);
    }
  });

  it("maps XLSX / size failures to a CSV suggestion", () => {
    expect(importErrorCopy("IMPORT_FILE_TOO_LARGE").action).toMatch(/csv/i);
    expect(importErrorCopy("IMPORT_ZIP_BOMB").action).toMatch(/csv/i);
  });

  it("maps 429 without a code to a quota action", () => {
    const copy = importErrorCopy(undefined, 429);
    expect(copy.message.toLowerCase()).toMatch(/limit|capacity|too many/);
  });

  it("maps dry-run 429 to a preview-limit message", () => {
    const copy = importErrorCopy("IMPORT_RATE_LIMITED", 429, "Too many dry-runs for this import in the last hour");
    expect(copy.message.toLowerCase()).toMatch(/preview/);
    expect(copy.action.toLowerCase()).toMatch(/status|don.t import|don't import/);
  });
});
