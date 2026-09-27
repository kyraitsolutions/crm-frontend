import { http, HttpResponse } from "msw";
import {
  apiDoc,
  apiDocs,
  dryRunFixture,
  importConfigFixture,
  jobFixture,
  previewFixture,
} from "@/pages/Contact/import/__tests__/fixtures";

let job = jobFixture({ status: "uploaded" });
let sseFails = 0;

export function resetImportMock() {
  job = jobFixture({ status: "uploaded" });
  sseFails = 0;
}

export function setMockJob(next: typeof job) {
  job = next;
}

export function failNextSse(times = 3) {
  sseFails = times;
}

export const handlers = [
  http.get("*/api/account/:accountId/contacts/imports/config", () => {
    return HttpResponse.json(apiDoc(importConfigFixture));
  }),
  http.get("*/api/account/:accountId/contacts/imports", () => {
    return HttpResponse.json(apiDocs([job]));
  }),
  http.post("*/api/account/:accountId/contacts/imports", () => {
    job = jobFixture({ status: "uploaded", id: "job-1" });
    return HttpResponse.json(
      apiDoc(
        {
          id: "job-1",
          status: "uploaded",
          key: "uploads/source.csv",
          expiresInSec: 900,
          maxBytes: 1024 * 1024,
          uploadUrl: "http://localhost/presign",
          upload: {
            url: "http://localhost/presign",
            fields: { key: "uploads/source.csv", policy: "hidden" },
            key: "uploads/source.csv",
            expiresInSec: 900,
            maxBytes: 1024 * 1024,
          },
        },
        201,
      ),
      { status: 201 },
    );
  }),
  http.post("http://localhost/presign", () => new HttpResponse(null, { status: 204 })),
  http.post("*/api/account/:accountId/contacts/imports/:jobId/complete-upload", () => {
    job = jobFixture({ status: "validating" });
    return HttpResponse.json(apiDoc(job));
  }),
  http.get("*/api/account/:accountId/contacts/imports/:jobId/preview", () => {
    return HttpResponse.json(apiDoc(previewFixture));
  }),
  http.post("*/api/account/:accountId/contacts/imports/:jobId/dry-run", () => {
    return HttpResponse.json(apiDoc(dryRunFixture));
  }),
  http.post("*/api/account/:accountId/contacts/imports/:jobId/start", () => {
    job = jobFixture({ status: "processing", processed: 1, percent: 50 });
    return HttpResponse.json(apiDoc(job));
  }),
  http.post("*/api/account/:accountId/contacts/imports/:jobId/pause", () => {
    job = { ...job, status: "paused" };
    return HttpResponse.json(apiDoc(job));
  }),
  http.post("*/api/account/:accountId/contacts/imports/:jobId/resume", () => {
    job = { ...job, status: "processing" };
    return HttpResponse.json(apiDoc(job));
  }),
  http.post("*/api/account/:accountId/contacts/imports/:jobId/cancel", () => {
    job = { ...job, status: "cancelled" };
    return HttpResponse.json(apiDoc(job));
  }),
  http.get("*/api/account/:accountId/contacts/imports/:jobId/errors", () => {
    return HttpResponse.json(apiDoc({ url: "http://localhost/errors.csv", expiresInSec: 300 }));
  }),
  http.get("*/api/account/:accountId/contacts/imports/:jobId/events", () => {
    if (sseFails > 0) {
      sseFails -= 1;
      return new HttpResponse("blocked", { status: 429 });
    }
    const body = `event: snapshot\ndata: ${JSON.stringify(job)}\n\n`;
    return new HttpResponse(body, {
      headers: { "Content-Type": "text/event-stream" },
    });
  }),
  http.get("*/api/account/:accountId/contacts/imports/:jobId", () => {
    return HttpResponse.json(apiDoc(job));
  }),
];
