import { describe, expect, it } from "vitest";
import { etaSeconds, formatEta, instantRate, smoothRate } from "../utils/eta";

describe("rate smoothing", () => {
  it("returns the first sample unchanged", () => {
    expect(smoothRate(null, 40)).toBe(40);
  });

  it("blends later samples", () => {
    const next = smoothRate(40, 20, 0.5);
    expect(next).toBe(30);
  });

  it("computes an instant rate from processed deltas", () => {
    expect(instantRate(10, 20, 1000)).toBe(10);
    expect(instantRate(20, 10, 1000)).toBe(0);
  });
});

describe("ETA", () => {
  it("is null when the rate is too low", () => {
    expect(etaSeconds(100, 0.01)).toBeNull();
  });

  it("rounds remaining seconds up", () => {
    expect(etaSeconds(10, 3)).toBe(4);
    expect(formatEta(4)).toBe("4s remaining");
    expect(formatEta(null)).toBe("Calculating…");
  });
});
