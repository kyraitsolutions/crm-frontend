import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useImportJob } from "../hooks/useImportJob";
import { failNextSse, resetImportMock, setMockJob } from "@/test/msw/handlers";
import { jobFixture } from "./fixtures";

vi.mock("@/utils/cookie-storage.utils", () => ({
  CookieUtils: { getItem: () => "test-token" },
}));

describe("useImportJob", () => {
  afterEach(() => {
    resetImportMock();
  });

  it("loads the job snapshot from GET", async () => {
    setMockJob(jobFixture({ status: "processing", processed: 2 }));
    const { result } = renderHook(() => useImportJob("acc1", "job-1"));
    await waitFor(() => expect(result.current.job?.status).toBe("processing"));
    expect(result.current.loading).toBe(false);
  });

  it("falls back to polling after repeated SSE failures", async () => {
    failNextSse(3);
    setMockJob(jobFixture({ status: "processing" }));
    const { result } = renderHook(() => useImportJob("acc1", "job-1"));
    await waitFor(() => expect(result.current.transport).toBe("poll"), { timeout: 4000 });
    expect(result.current.job?.id).toBe("job-1");
  });
});
