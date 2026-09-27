import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type Route } from "@playwright/test";

const ACCOUNT = "acc1";
const JOB = "job-1";
const API = "http://localhost:3000";

const user = {
  id: 1,
  email: "e2e@kyra.test",
  firstName: "E2E",
  lastName: "User",
  profilePicture: "",
  createdAt: "",
  updatedAt: "",
  onboarding: true,
  role: { name: "ADMIN", level: 1 },
  organization: { id: "org1", name: "Kyra" },
  userProfile: {
    firstName: "E2E",
    lastName: "User",
    organizationName: "Kyra",
    accountType: "paid",
    profilePicture: "",
  },
  account: { id: ACCOUNT },
  subscription: { planId: "p", startedAt: new Date(), expiresAt: new Date() },
  permissions: ["contacts.import"],
};

const config = {
  limits: { maxFileBytes: 1024 * 1024, maxRows: 500, allowedTypes: [".csv", ".xlsx"] },
  fields: [
    { key: "name", label: "Name", type: "string", allowedTransforms: ["none", "trim"], identityKey: false },
    { key: "phone", label: "Phone", type: "string", allowedTransforms: ["none", "trim"], identityKey: true },
    { key: "email", label: "Email", type: "string", allowedTransforms: ["none", "lowercase"], identityKey: true },
    { key: "ignore", label: "Ignore", type: "none", allowedTransforms: ["none"], identityKey: false },
  ],
  policies: [
    { key: "skip", description: "Leave existing contacts unchanged." },
    { key: "update", description: "Overwrite mapped fields." },
    { key: "merge", description: "Fill empty fields only." },
  ],
  merge: { emptyOnly: ["name"], tags: ["union"], allowStatusUpgrade: false },
  consentText: { version: "import-consent-v1", text: "I confirm these contacts consented." },
  defaultCountry: { code: null, source: "none" },
};

function envelope(doc: unknown, status = 200) {
  return { success: true, responseStatusCode: status, responseMessage: "ok", result: { doc } };
}

function jobDoc(status: string, extra: Record<string, unknown> = {}) {
  return {
    id: JOB,
    status,
    file: { fileName: "contacts.csv", mimeType: "text/csv", byteSize: 40, key: "uploads/source.csv" },
    processed: extra.processed ?? 0,
    total: extra.total ?? 2,
    percent: extra.percent ?? 0,
    totals: extra.totals ?? { processed: 0, inserted: 0, updated: 0, skipped: 0, failed: 0, duplicates: 0 },
    rowErrorPreview: extra.rowErrorPreview ?? [],
    timestamps: { createdAt: "2026-01-01", updatedAt: "2026-01-01" },
    errorReportAvailable: extra.errorReportAvailable ?? false,
    ...extra,
  };
}

async function seedAuth(page: Page) {
  await page.context().addCookies([
    {
      name: "_pre_app_au_t*h_t/o*ke*n-pmn",
      value: encodeURIComponent(JSON.stringify("e2e-token")),
      domain: "127.0.0.1",
      path: "/",
    },
    {
      name: "_pre-app-account-xd-uid-pmn",
      value: encodeURIComponent(JSON.stringify(ACCOUNT)),
      domain: "127.0.0.1",
      path: "/",
    },
    {
      name: "_pre-app-account-xd-nm-pmn",
      value: encodeURIComponent(JSON.stringify("E2E")),
      domain: "127.0.0.1",
      path: "/",
    },
  ]);
}

async function stubShell(page: Page) {
  await page.route(`${API}/api/**`, async (route) => {
    await route.fulfill({
      json: { success: true, responseStatusCode: 200, responseMessage: "ok", result: { doc: {}, docs: [] } },
    });
  });
  await page.route(`${API}/api/auth/me**`, async (route) => {
    await route.fulfill({ json: envelope(user) });
  });
  await page.route(`${API}/api/account`, async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        json: { success: true, responseStatusCode: 200, result: { docs: [{ id: ACCOUNT, accountName: "E2E" }] } },
      });
      return;
    }
    await route.fallback();
  });
  await page.route(`${API}/api/account/${ACCOUNT}/access`, async (route) => {
    await route.fulfill({
      json: envelope({ accountId: ACCOUNT, role: "ADMIN", permissions: ["*", "contacts.import"] }),
    });
  });
  await page.route(`${API}/api/subscription`, async (route) => {
    await route.fulfill({
      json: envelope({
        isExpired: false,
        isActive: true,
        isTrial: false,
        features: {},
        limits: {},
        usage: {},
        plan: { name: "Pro" },
        trial: { daysRemaining: 0 },
        expirationPrompt: { shouldShow: false },
      }),
    });
  });
}

async function checkA11y(page: Page) {
  const results = await new AxeBuilder({ page })
    .include('[data-testid="contact-import"]')
    .disableRules(["color-contrast"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await seedAuth(page);
  await stubShell(page);
  await page.addInitScript(() => {
    localStorage.setItem("notification_prompt_seen", "true");
  });
});

test("happy path with a small CSV", async ({ page }) => {
  let status = "uploaded";
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/config`, async (route) => {
    await route.fulfill({ json: envelope(config) });
  });
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports`, async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 201,
        json: envelope(
          {
            id: JOB,
            status: "uploaded",
            key: "uploads/source.csv",
            expiresInSec: 900,
            maxBytes: 1024,
            upload: {
              url: `${API}/presign-upload`,
              fields: { key: "uploads/source.csv", policy: "x" },
              key: "uploads/source.csv",
              expiresInSec: 900,
              maxBytes: 1024,
            },
          },
          201,
        ),
      });
      return;
    }
    await route.fulfill({ json: { success: true, result: { docs: [jobDoc(status)] } } });
  });
  await page.route(`${API}/presign-upload`, async (route) => {
    await route.fulfill({ status: 204, body: "" });
  });
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/${JOB}/complete-upload`, async (route) => {
    status = "validating";
    await route.fulfill({ json: envelope(jobDoc(status)) });
  });
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/${JOB}/preview`, async (route) => {
    await route.fulfill({
      json: envelope({
        headers: ["name", "phone"],
        sampleRows: [["Ada", "9876543210"]],
        totalRows: 2,
        suggestedMapping: [
          { source: "name", target: "name" },
          { source: "phone", target: "phone" },
        ],
      }),
    });
  });
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/${JOB}/dry-run`, async (route) => {
    await route.fulfill({
      json: envelope({
        sampled: 2,
        valid: 2,
        invalid: 0,
        byErrorCode: {},
        invalidSamples: [],
        validSamples: [
          { rowNumber: 1, raw: ["Ada", "9876543210"], normalized: { phone: "+919876543210" } },
        ],
        existingMatches: { count: 0, phones: [], emails: [] },
      }),
    });
  });
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/${JOB}/start`, async (route) => {
    status = "processing";
    await route.fulfill({ json: envelope(jobDoc(status, { processed: 1, percent: 50 })) });
  });
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/${JOB}/events`, async (route) => {
    await route.fulfill({
      status: 200,
      headers: { "content-type": "text/event-stream" },
      body: `event: snapshot\ndata: ${JSON.stringify(jobDoc(status))}\n\n`,
    });
  });
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/${JOB}`, async (route) => {
    if (status === "validating") {
      status = "mapping";
    }
    await route.fulfill({ json: envelope(jobDoc(status)) });
  });

  await page.goto(`/dashboard/account/${ACCOUNT}/contacts/imports/new`);
  await expect(page.getByRole("heading", { name: /upload contacts/i })).toBeVisible();
  await checkA11y(page);
  await page.locator('input[type="file"]').setInputFiles({
    name: "contacts.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("name,phone\nAda,9876543210\n"),
  });
  await expect(page.getByRole("heading", { name: /map columns/i })).toBeVisible({ timeout: 15_000 });
  await checkA11y(page);
  await page.getByLabel("Default country (required)").click();
  await page.getByRole("option", { name: /^IN / }).click();
  await expect(page.getByRole("button", { name: /continue to review/i })).toBeEnabled({ timeout: 10_000 });
  await page.getByRole("button", { name: /continue to review/i }).click();
  await expect(page.getByRole("heading", { name: /review and start/i })).toBeVisible();
  await checkA11y(page);
  await page.getByRole("button", { name: /start import/i }).click();
  await expect(page.getByText(/safe to leave this page/i)).toBeVisible();
  await checkA11y(page);
});

test("upload cancel stops the request", async ({ page }) => {
  let aborted = false;
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/config`, async (route) => {
    await route.fulfill({ json: envelope(config) });
  });
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports`, async (route) => {
    await route.fulfill({
      status: 201,
      json: envelope({
        id: JOB,
        status: "uploaded",
        key: "k",
        expiresInSec: 900,
        maxBytes: 1024,
        upload: { url: `${API}/presign-slow`, fields: { key: "k" }, key: "k", expiresInSec: 900, maxBytes: 1024 },
      }, 201),
    });
  });
  await page.route(`${API}/presign-slow`, async (route) => {
    await new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, 30_000);
      route.request().frame();
      page.once("close", () => {
        clearTimeout(timer);
        aborted = true;
        resolve();
      });
    }).catch(() => {
      aborted = true;
    });
    if (!aborted) {
      await route.fulfill({ status: 204, body: "" });
    }
  });

  await page.goto(`/dashboard/account/${ACCOUNT}/contacts/imports/new`);
  await page.locator('input[type="file"]').setInputFiles({
    name: "contacts.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("name,phone\nAda,1\n"),
  });
  await page.getByRole("button", { name: /cancel upload/i }).click();
  await expect(page.getByText(/upload cancelled/i)).toBeVisible();
});

test("expired presign creates a new job", async ({ page }) => {
  let creates = 0;
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/config`, async (route) => {
    await route.fulfill({ json: envelope(config) });
  });
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports`, async (route) => {
    if (route.request().method() !== "POST") {
      await route.fulfill({ json: { success: true, result: { docs: [] } } });
      return;
    }
    creates += 1;
    await route.fulfill({
      status: 201,
      json: envelope({
        id: `job-${creates}`,
        status: "uploaded",
        key: "k",
        expiresInSec: 900,
        maxBytes: 1024,
        upload: {
          url: `${API}/presign-${creates}`,
          fields: { key: "k" },
          key: "k",
          expiresInSec: 900,
          maxBytes: 1024,
        },
      }, 201),
    });
  });
  await page.route(`${API}/presign-1`, async (route) => {
    await route.fulfill({ status: 403, body: "expired" });
  });
  await page.route(`${API}/presign-2`, async (route) => {
    await route.fulfill({ status: 204, body: "" });
  });
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/job-2/complete-upload`, async (route) => {
    await route.fulfill({ json: envelope(jobDoc("validating", { id: "job-2" })) });
  });
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/job-2**`, async (route: Route) => {
    if (route.request().url().includes("complete-upload")) {
      await route.fallback();
      return;
    }
    await route.fulfill({ json: envelope(jobDoc("mapping", { id: "job-2" })) });
  });

  await page.goto(`/dashboard/account/${ACCOUNT}/contacts/imports/new`);
  await page.locator('input[type="file"]').setInputFiles({
    name: "contacts.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("name,phone\nAda,9876543210\n"),
  });
  await expect.poll(() => creates).toBe(2);
});

test("409 wrong state and 429 quota show mapped messages", async ({ page }) => {
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/config`, async (route) => {
    await route.fulfill({ json: envelope(config) });
  });
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/${JOB}/preview`, async (route) => {
    await route.fulfill({
      status: 409,
      json: { success: false, responseStatusCode: 409, responseMessage: "wrong", code: "IMPORT_INVALID_STATE" },
    });
  });
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/${JOB}**`, async (route) => {
    if (route.request().url().includes("preview")) {
      await route.fallback();
      return;
    }
    if (route.request().url().includes("start")) {
      await route.fulfill({
        status: 429,
        json: { success: false, responseStatusCode: 429, code: "IMPORT_RATE_LIMITED", responseMessage: "quota" },
      });
      return;
    }
    await route.fulfill({ json: envelope(jobDoc("mapping")) });
  });

  await page.goto(`/dashboard/account/${ACCOUNT}/contacts/imports/${JOB}`);
  await expect(page.getByText(/not in the right step/i)).toBeVisible();

  await page.unroute(`${API}/api/account/${ACCOUNT}/contacts/imports/${JOB}/preview`);
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/${JOB}/preview`, async (route) => {
    await route.fulfill({
      json: envelope({
        headers: ["phone"],
        sampleRows: [["+9198"]],
        totalRows: 1,
        suggestedMapping: [{ source: "phone", target: "phone" }],
      }),
    });
  });
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/${JOB}/dry-run`, async (route) => {
    await route.fulfill({
      json: envelope({
        sampled: 1,
        valid: 1,
        invalid: 0,
        byErrorCode: {},
        invalidSamples: [],
        validSamples: [],
        existingMatches: { count: 0, phones: [], emails: [] },
      }),
    });
  });
  await page.reload();
  await page.getByLabel("Default country (required)").click();
  await page.getByRole("option", { name: /^IN / }).click();
  await page.getByRole("button", { name: /continue to review/i }).click();
  await page.getByRole("button", { name: /start import/i }).click();
  await expect(page.getByText(/rate or contact capacity/i)).toBeVisible();
});

test("SSE drop falls back to polling and reload restores processing", async ({ page }) => {
  let events = 0;
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/config`, async (route) => {
    await route.fulfill({ json: envelope(config) });
  });
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/${JOB}/events`, async (route) => {
    events += 1;
    await route.fulfill({ status: 429, json: { code: "IMPORT_RATE_LIMITED" } });
  });
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/${JOB}`, async (route) => {
    await route.fulfill({
      json: envelope(jobDoc("processing", { processed: 4, total: 10, percent: 40 })),
    });
  });

  await page.goto(`/dashboard/account/${ACCOUNT}/contacts/imports/${JOB}`);
  await expect(page.getByText(/4 of 10 rows/i)).toBeVisible();
  await expect.poll(() => events).toBeGreaterThan(0);
  await page.reload();
  await expect(page.getByText(/4 of 10 rows/i)).toBeVisible();
  await checkA11y(page);
});

test("completed with errors offers a report download", async ({ page }) => {
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/config`, async (route) => {
    await route.fulfill({ json: envelope(config) });
  });
  await page.route(`${API}/api/account/${ACCOUNT}/contacts/imports/${JOB}**`, async (route) => {
    if (route.request().url().includes("/errors")) {
      await route.fulfill({ json: envelope({ url: `${API}/errors.csv`, expiresInSec: 60 }) });
      return;
    }
    await route.fulfill({
      json: envelope(
        jobDoc("completed_with_errors", {
          processed: 2,
          total: 2,
          percent: 100,
          errorReportAvailable: true,
          rowErrorPreview: [{ rowNumber: 2, reason: "INVALID_PHONE", rawValue: "123", raw: ["x"] }],
        }),
      ),
    });
  });

  await page.goto(`/dashboard/account/${ACCOUNT}/contacts/imports/${JOB}`);
  await expect(page.getByRole("button", { name: /download error report/i })).toBeVisible();
  await expect(page.getByText(/phone number could not be read/i)).toBeVisible();
  await checkA11y(page);
});
