import DataLoader from "@/components/Loader/data-loader";
import { Button } from "@/components/ui/button";
import { COOKIES_STORAGE } from "@/constants";
import { CONTACT_PATHS } from "@/constants/routes/contact.path";
import { useAuthStore } from "@/stores";
import type { ApiError } from "@/types";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { ImportErrorAlert, importErrorText } from "../components/ImportErrorAlert";
import { ImportStepper } from "../components/ImportStepper";
import { UploadStep, uploadClientError } from "../components/UploadStep";
import { idempotencyStorageKey } from "../constants/import.constant";
import { useImportConfig } from "../hooks/useImportConfig";
import { contactImportService } from "../services/contact-import.service";
import { isLocalUploadUrl, uploadLocalSource, uploadPresignedPost } from "../services/presigned-upload";
import { contentTypeForFile, validateImportFile } from "../utils/file";

export default function ImportNewPage() {
  const navigate = useNavigate();
  const { accountId } = useAuthStore((state) => state);
  const id = String(accountId || "");
  const { config, error: configError, loading } = useImportConfig(id || undefined);
  const [fileName, setFileName] = useState<string | null>(null);
  const [percent, setPercent] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<{ abort: () => void } | null>(null);

  const historyHref = CONTACT_PATHS.getHistory(id);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (uploading) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [uploading]);

  const runUpload = useCallback(
    async (file: File, reuseKey?: string) => {
      if (!config) {
        return;
      }
      const check = validateImportFile(file, config);
      if (!check.ok) {
        setError(uploadClientError(check.code));
        return;
      }
      setFileName(file.name);
      setError(null);
      setUploading(true);
      setPercent(0);
      const key = reuseKey ?? uuid();
      sessionStorage.setItem(idempotencyStorageKey(id), key);
      try {
        const created = await contactImportService.createJob(
          id,
          {
            fileName: file.name,
            fileSize: file.size,
            contentType: contentTypeForFile(file),
          },
          key,
        );
        const post = created.upload
          ? { url: created.upload.url, fields: created.upload.fields }
          : created.uploadUrl
            ? { url: created.uploadUrl, fields: { key: created.key } }
            : null;
        if (!post) {
          throw { message: "Upload URL was missing. Start a new import.", status: 400 } satisfies ApiError;
        }
        const token = CookieUtils.getItem(COOKIES_STORAGE.auth_token);
        const handle = isLocalUploadUrl(post.url)
          ? uploadLocalSource(
              contactImportService.localUploadUrl(id, created.id),
              file,
              post.fields,
              token ? { Authorization: `Bearer ${token}` } : {},
              setPercent,
            )
          : uploadPresignedPost(post, file, setPercent);
        abortRef.current = handle;
        try {
          await handle.promise;
        } catch (uploadError) {
          if ((uploadError as { aborted?: boolean }).aborted) {
            setError("Upload cancelled.");
            return;
          }
          sessionStorage.removeItem(idempotencyStorageKey(id));
          if (!reuseKey) {
            await runUpload(file, uuid());
            return;
          }
          throw uploadError;
        }
        setAnalyzing(true);
        await contactImportService.completeUpload(id, created.id);
        sessionStorage.removeItem(idempotencyStorageKey(id));
        navigate(CONTACT_PATHS.getJob(id, created.id), { replace: true });
      } catch (err) {
        sessionStorage.removeItem(idempotencyStorageKey(id));
        setError(importErrorText(err as ApiError));
        setAnalyzing(false);
      } finally {
        setUploading(false);
        abortRef.current = null;
      }
    },
    [config, id, navigate],
  );

  if (loading) {
    return <DataLoader className="h-64" />;
  }

  if (configError || !config) {
    return (
      <div className="px-6 py-6">
        <ImportErrorAlert error={configError} />
        <Button asChild className="mt-4" variant="outline">
          <Link to={historyHref}>Back to imports</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <ImportStepper current={0} />
      <UploadStep
        config={config}
        fileName={fileName}
        uploadPercent={percent}
        uploading={uploading}
        analyzing={analyzing}
        error={error ?? undefined}
        onFile={(file) => void runUpload(file)}
        onCancel={() => abortRef.current?.abort()}
      />
      <Button asChild variant="ghost" className="mt-6">
        <Link to={historyHref}>Import history</Link>
      </Button>
    </div>
  );
}
