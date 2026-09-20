import DataLoader from "@/components/Loader/data-loader";
import { Button } from "@/components/ui/button";
import { CONTACT_PATHS } from "@/constants/routes/contact.path";
import { ToastMessageService } from "@/services";
import { useAuthStore } from "@/stores";
import type { ApiError } from "@/types";
import { useEffect, useReducer, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CancelImportButton } from "../components/CancelImportButton";
import { ImportErrorAlert, importErrorText } from "../components/ImportErrorAlert";
import { ImportStepper } from "../components/ImportStepper";
import { MappingStep } from "../components/MappingStep";
import { ProgressStep } from "../components/ProgressStep";
import { ReviewStep } from "../components/ReviewStep";
import { IMPORT_DRY_RUN_DEBOUNCE_MS, IMPORT_SAMPLE_SIZE } from "../constants/import.constant";
import { useImportConfig } from "../hooks/useImportConfig";
import { useImportJob } from "../hooks/useImportJob";
import { contactImportService } from "../services/contact-import.service";
import { initialWizardState, wizardReducer, type WizardState } from "../state/wizard.reducer";
import {
  defaultTransformForTarget,
  identityKeysFromMapping,
  mappingFromPreview,
  toStartMapping,
} from "../utils/mapping";
import { etaSeconds, instantRate, smoothRate } from "../utils/eta";
import useDebounce from "@/hooks/useDebounce";

const toast = new ToastMessageService();

export default function ImportJobPage() {
  const { jobId = "" } = useParams();
  const { accountId } = useAuthStore((state) => state);
  const id = String(accountId || "");
  const { job, error, loading, reload } = useImportJob(id || undefined, jobId);
  const { config, error: configError, loading: configLoading } = useImportConfig(id || undefined);
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  const [dryRunLoading, setDryRunLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [previewError, setPreviewError] = useState<ApiError | null>(null);
  const [dryRunError, setDryRunError] = useState<ApiError | null>(null);
  const [previewAttempt, setPreviewAttempt] = useState(0);
  const headingStep = state.step;
  const rateRef = useRef<{ processed: number; at: number; rate: number | null }>({
    processed: 0,
    at: Date.now(),
    rate: null,
  });
  const [rate, setRate] = useState(0);

  useEffect(() => {
    if (job) {
      dispatch({ type: "JOB_SNAPSHOT", job });
    }
  }, [job]);

  useEffect(() => {
    const heading = document.getElementById(
      headingStep === "mapping"
        ? "import-mapping-heading"
        : headingStep === "review"
          ? "import-review-heading"
          : headingStep === "progress"
            ? "import-progress-heading"
            : "import-analyzing-heading",
    );
    heading?.focus();
  }, [headingStep]);

  useEffect(() => {
    if (!job || !id || job.status !== "mapping" || state.preview) {
      return;
    }
    let cancelled = false;
    contactImportService
      .getPreview(id, job.id)
      .then((preview) => {
        if (cancelled || !config) {
          return;
        }
        dispatch({
          type: "PREVIEW_LOADED",
          preview,
          mapping: mappingFromPreview(preview, config),
          defaultCountry: config.defaultCountry.code ?? "",
          countrySource: config.defaultCountry.source,
        });
      })
      .catch((err: ApiError) => {
        if (!cancelled) {
          setPreviewError(err);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [config, id, job, previewAttempt, state.preview]);

  const dryRunKey = useDebounce(
    JSON.stringify({
      jobId: job?.id,
      mapping: state.mapping,
      policy: state.policy,
      country: state.defaultCountry,
      ready: Boolean(job && config && state.preview && job.status === "mapping"),
    }),
    IMPORT_DRY_RUN_DEBOUNCE_MS,
  );

  useEffect(() => {
    let payload: {
      jobId?: string;
      ready?: boolean;
      country: string;
      mapping: WizardState["mapping"];
      policy: WizardState["policy"];
    };
    try {
      payload = JSON.parse(dryRunKey) as typeof payload;
    } catch {
      return;
    }
    const identity = identityKeysFromMapping(payload.mapping);
    if (
      !payload.jobId ||
      !payload.ready ||
      !/^[A-Za-z]{2}$/.test(payload.country) ||
      identity.length === 0
    ) {
      return;
    }
    let cancelled = false;
    setDryRunLoading(true);
    setDryRunError(null);
    contactImportService
      .dryRun(id, payload.jobId, {
        mapping: toStartMapping(payload.mapping),
        identity: { keys: identity },
        policy: payload.policy,
        defaultCountry: payload.country,
        sampleSize: IMPORT_SAMPLE_SIZE,
      })
      .then((result) => {
        if (!cancelled) {
          dispatch({ type: "DRY_RUN", result });
          setDryRunError(null);
        }
      })
      .catch((err: ApiError) => {
        if (!cancelled) {
          setDryRunError(err);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setDryRunLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [dryRunKey, id]);

  useEffect(() => {
    if (!job) {
      return;
    }
    const now = Date.now();
    const instant = instantRate(rateRef.current.processed, job.processed, now - rateRef.current.at);
    const next = smoothRate(rateRef.current.rate, instant);
    rateRef.current = { processed: job.processed, at: now, rate: next };
    setRate(next);
  }, [job]);

  const startImport = async () => {
    if (!job || !config) {
      return;
    }
    setStarting(true);
    try {
      const tags = config.merge.tags.includes("union") ? "union" : "replace";
      await contactImportService.start(id, job.id, {
        mapping: toStartMapping(state.mapping),
        identity: { keys: identityKeysFromMapping(state.mapping) },
        policy: state.policy,
        merge: {
          emptyOnly: config.merge.emptyOnly,
          tags: tags as "union" | "replace",
          allowStatusUpgrade: config.merge.allowStatusUpgrade,
        },
        defaultCountry: state.defaultCountry,
        ...(state.consent
          ? { consentAttestation: { confirmed: true as const, textVersion: config.consentText.version } }
          : {}),
      });
      await reload();
    } catch (err) {
      toast.apiError(importErrorText(err as ApiError));
    } finally {
      setStarting(false);
    }
  };

  const cancelJob = async () => {
    if (!job) {
      return;
    }
    try {
      await contactImportService.cancel(id, job.id);
      await reload();
    } catch (err) {
      toast.apiError(importErrorText(err as ApiError));
    }
  };

  if (loading || configLoading) {
    return <DataLoader className="h-64" />;
  }

  if (error || configError || !job || !config) {
    return (
      <div className="px-6 py-6">
        <ImportErrorAlert error={error ?? configError} />
        <Button asChild className="mt-4" variant="outline">
          <Link to={CONTACT_PATHS.getHistory(id)}>Back to imports</Link>
        </Button>
      </div>
    );
  }

  if (job.status === "uploaded" && !state.analyzing) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-6">
        <h1 className="text-xl font-semibold">Upload did not finish</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The file is not available after a reload. Cancel this job, then start a new import.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <CancelImportButton onCancel={cancelJob} />
          <Button asChild>
            <Link to={CONTACT_PATHS.getNew(id)}>New import</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (state.step === "analyzing" || job.status === "scanning" || job.status === "validating") {
    return (
      <div className="mx-auto max-w-3xl px-6 py-6">
        <ImportStepper current={0} />
        <h1 id="import-analyzing-heading" tabIndex={-1} className="text-xl font-semibold text-primary">
          Analyzing file
        </h1>
        <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">
          Reading headers and sample rows. This page updates from the server.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <CancelImportButton onCancel={cancelJob} />
          <Button asChild variant="ghost">
            <Link to={CONTACT_PATHS.getHistory(id)}>Import history</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (job.status === "mapping" && !state.preview) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-6">
        <ImportStepper current={1} />
        <h1 id="import-mapping-heading" tabIndex={-1} className="text-xl font-semibold text-primary">
          Map columns
        </h1>
        {previewError ? (
          <>
            <ImportErrorAlert error={previewError} />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => {
                setPreviewError(null);
                setPreviewAttempt((n) => n + 1);
                void reload();
              }}>
                Try again
              </Button>
              <CancelImportButton onCancel={cancelJob} />
            </div>
          </>
        ) : (
          <DataLoader className="h-48" />
        )}
      </div>
    );
  }

  if (state.step === "mapping" && state.preview) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-6">
        <ImportStepper current={1} />
        {previewError ? <ImportErrorAlert error={previewError} /> : null}
        <MappingStep
          config={config}
          preview={state.preview}
          mapping={state.mapping}
          policy={state.policy}
          defaultCountry={state.defaultCountry}
          dryRun={state.dryRun}
          dryRunLoading={dryRunLoading}
          dryRunError={dryRunError}
          onTarget={(source, target) =>
            dispatch({
              type: "SET_TARGET",
              source,
              target,
              transform: defaultTransformForTarget(target, config),
            })
          }
          onTransform={(source, transform) => dispatch({ type: "SET_TRANSFORM", source, transform })}
          onPolicy={(policy) => dispatch({ type: "SET_POLICY", policy })}
          onCountry={(country) => dispatch({ type: "SET_COUNTRY", country })}
          onContinue={() => dispatch({ type: "GO_REVIEW" })}
        />
        <div className="mt-4">
          <CancelImportButton onCancel={cancelJob} />
        </div>
      </div>
    );
  }

  if (state.step === "review" && state.preview) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-6">
        <ImportStepper current={2} />
        <ReviewStep
          fileName={job.file.fileName}
          fileSize={job.file.byteSize}
          preview={state.preview}
          mapping={state.mapping}
          policy={state.policy}
          defaultCountry={state.defaultCountry}
          dryRun={state.dryRun}
          config={config}
          consent={state.consent}
          starting={starting}
          onConsent={(value) => dispatch({ type: "SET_CONSENT", consent: value })}
          onBack={() => dispatch({ type: "GO_MAPPING" })}
          onStart={() => void startImport()}
        />
      </div>
    );
  }

  const remaining = Math.max(0, job.total - job.processed);
  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      <ImportStepper current={3} />
      <Button asChild variant="ghost" className="mb-4">
        <Link to={CONTACT_PATHS.getHistory(id)}>Import history</Link>
      </Button>
      <ProgressStep
        job={job}
        rowsPerSec={rate}
        eta={etaSeconds(remaining, rate)}
        onPause={async () => {
          try {
            await contactImportService.pause(id, job.id);
            await reload();
          } catch (err) {
            toast.apiError(importErrorText(err as ApiError));
          }
        }}
        onResume={async () => {
          try {
            await contactImportService.resume(id, job.id);
            await reload();
          } catch (err) {
            toast.apiError(importErrorText(err as ApiError));
          }
        }}
        onCancel={async () => {
          try {
            await contactImportService.cancel(id, job.id);
            await reload();
          } catch (err) {
            toast.apiError(importErrorText(err as ApiError));
          }
        }}
        onDownloadErrors={async () => {
          try {
            await contactImportService.downloadErrorReport(id, job.id);
          } catch (err) {
            toast.apiError(importErrorText(err as ApiError));
          }
        }}
      />
    </div>
  );
}
