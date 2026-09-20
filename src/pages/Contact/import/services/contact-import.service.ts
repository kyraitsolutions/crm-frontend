import { COOKIES_STORAGE } from "@/constants";
import { ApiService } from "@/services";
import type { ApiError, ApiResponse } from "@/types";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import type { ZodType } from "zod";
import {
  DryRunDocSchema,
  ImportConfigDocSchema,
  ImportCreateDocSchema,
  ImportErrorDownloadDocSchema,
  ImportJobDocSchema,
  ImportListResultSchema,
  ImportPreviewDocSchema,
  type DuplicatePolicy,
  type DryRunDoc,
  type ImportConfigDoc,
  type ImportCreateDoc,
  type ImportErrorDownloadDoc,
  type ImportFieldMapping,
  type ImportJobDoc,
  type ImportListResult,
  type ImportPreviewDoc,
  type ImportStatus,
} from "../types/import.schema";
import { isLocalDownloadUrl } from "./presigned-upload";

function parseDoc<T>(schema: ZodType<T>, value: unknown, label: string): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    const error: ApiError = {
      message: `The ${label} response was invalid. Refresh and try again.`,
      status: 500,
      code: "IMPORT_RESPONSE_INVALID",
    };
    throw error;
  }
  return parsed.data;
}

export class ContactImportService extends ApiService {
  private base(accountId: string): string {
    return `/account/${accountId}/contacts/imports`;
  }

  async getConfig(accountId: string): Promise<ImportConfigDoc> {
    const res = await this.get<ImportConfigDoc>(`${this.base(accountId)}/config`);
    return parseDoc(ImportConfigDocSchema, res.data?.doc, "import config");
  }

  async createJob(
    accountId: string,
    body: { fileName: string; fileSize: number; contentType: string },
    idempotencyKey: string,
  ): Promise<ImportCreateDoc> {
    const res = await this.post<ImportCreateDoc>(this.base(accountId), body, {
      headers: { "Idempotency-Key": idempotencyKey },
    });
    return parseDoc(ImportCreateDocSchema, res.data?.doc, "import create");
  }

  localUploadUrl(accountId: string, jobId: string): string {
    return `${this.getBaseUrl()}${this.base(accountId)}/${jobId}/local-upload`;
  }

  async completeUpload(accountId: string, jobId: string): Promise<ImportJobDoc> {
    const res = await this.post<ImportJobDoc>(`${this.base(accountId)}/${jobId}/complete-upload`);
    return parseDoc(ImportJobDocSchema, res.data?.doc, "complete-upload");
  }

  async getJob(accountId: string, jobId: string): Promise<ImportJobDoc> {
    const res = await this.get<ImportJobDoc>(`${this.base(accountId)}/${jobId}`);
    return parseDoc(ImportJobDocSchema, res.data?.doc, "import status");
  }

  async getPreview(accountId: string, jobId: string): Promise<ImportPreviewDoc> {
    const res = await this.get<ImportPreviewDoc>(`${this.base(accountId)}/${jobId}/preview`);
    return parseDoc(ImportPreviewDocSchema, res.data?.doc, "import preview");
  }

  async dryRun(
    accountId: string,
    jobId: string,
    body: {
      mapping: ImportFieldMapping[];
      identity?: { keys: Array<"phone" | "email"> };
      policy: DuplicatePolicy;
      defaultCountry: string;
      sampleSize?: number;
    },
  ): Promise<DryRunDoc> {
    const res = await this.post<DryRunDoc>(`${this.base(accountId)}/${jobId}/dry-run`, body);
    return parseDoc(DryRunDocSchema, res.data?.doc, "import dry-run");
  }

  async start(
    accountId: string,
    jobId: string,
    body: {
      mapping: ImportFieldMapping[];
      identity?: { keys: Array<"phone" | "email"> };
      policy: DuplicatePolicy;
      merge?: { emptyOnly: string[]; tags: "union" | "replace"; allowStatusUpgrade: boolean };
      defaultCountry: string;
      consentAttestation?: { confirmed: true; textVersion?: string };
    },
  ): Promise<ImportJobDoc> {
    const res = await this.post<ImportJobDoc>(`${this.base(accountId)}/${jobId}/start`, body);
    return parseDoc(ImportJobDocSchema, res.data?.doc, "import start");
  }

  async pause(accountId: string, jobId: string): Promise<ImportJobDoc> {
    const res = await this.post<ImportJobDoc>(`${this.base(accountId)}/${jobId}/pause`);
    return parseDoc(ImportJobDocSchema, res.data?.doc, "import pause");
  }

  async resume(accountId: string, jobId: string): Promise<ImportJobDoc> {
    const res = await this.post<ImportJobDoc>(`${this.base(accountId)}/${jobId}/resume`);
    return parseDoc(ImportJobDocSchema, res.data?.doc, "import resume");
  }

  async cancel(accountId: string, jobId: string): Promise<ImportJobDoc> {
    const res = await this.post<ImportJobDoc>(`${this.base(accountId)}/${jobId}/cancel`);
    return parseDoc(ImportJobDocSchema, res.data?.doc, "import cancel");
  }

  async list(
    accountId: string,
    query?: { status?: ImportStatus | ""; cursor?: string; limit?: number },
  ): Promise<ImportListResult> {
    const res: ApiResponse<ImportJobDoc> = await this.get(this.base(accountId), query);
    return parseDoc(
      ImportListResultSchema,
      { docs: res.data?.docs ?? [], nextCursor: (res.data as { nextCursor?: string })?.nextCursor },
      "import list",
    );
  }

  async getErrorDownload(accountId: string, jobId: string): Promise<ImportErrorDownloadDoc> {
    const res = await this.get<ImportErrorDownloadDoc>(`${this.base(accountId)}/${jobId}/errors`);
    return parseDoc(ImportErrorDownloadDocSchema, res.data?.doc, "import errors");
  }

  async downloadErrorReport(accountId: string, jobId: string): Promise<void> {
    const report = await this.getErrorDownload(accountId, jobId);
    if (!isLocalDownloadUrl(report.url)) {
      window.open(report.url, "_blank", "noopener,noreferrer");
      return;
    }
    const token = CookieUtils.getItem(COOKIES_STORAGE.auth_token);
    const response = await fetch(`${this.getBaseUrl()}${this.base(accountId)}/${jobId}/errors/file`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) {
      const error: ApiError = {
        message: "The error report could not be downloaded.",
        status: response.status,
      };
      throw error;
    }
    const blob = await response.blob();
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `import-${jobId}-errors.csv`;
    link.click();
    URL.revokeObjectURL(href);
  }

  eventsUrl(accountId: string, jobId: string): string {
    return `${this.getBaseUrl()}${this.base(accountId)}/${jobId}/events`;
  }
}

export const contactImportService = new ContactImportService();
