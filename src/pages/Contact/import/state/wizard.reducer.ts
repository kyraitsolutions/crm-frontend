import type { DuplicatePolicy, DryRunDoc, ImportJobDoc, ImportPreviewDoc } from "../types/import.schema";
import type { MappingRow } from "../utils/mapping";

export type WizardStep = "upload" | "analyzing" | "mapping" | "review" | "progress";

export interface WizardState {
  step: WizardStep;
  clientStep: "mapping" | "review";
  analyzing: boolean;
  job: ImportJobDoc | null;
  fileName: string | null;
  uploadPercent: number;
  uploading: boolean;
  mapping: MappingRow[];
  policy: DuplicatePolicy;
  defaultCountry: string;
  countrySource: "organization" | "none" | "user";
  consent: boolean;
  preview: ImportPreviewDoc | null;
  dryRun: DryRunDoc | null;
}

export const initialWizardState: WizardState = {
  step: "upload",
  clientStep: "mapping",
  analyzing: false,
  job: null,
  fileName: null,
  uploadPercent: 0,
  uploading: false,
  mapping: [],
  policy: "update",
  defaultCountry: "",
  countrySource: "none",
  consent: false,
  preview: null,
  dryRun: null,
};

export type WizardAction =
  | { type: "RESET" }
  | { type: "FILE_CHOSEN"; fileName: string }
  | { type: "UPLOAD_STARTED" }
  | { type: "UPLOAD_PROGRESS"; percent: number }
  | { type: "UPLOAD_FINISHED" }
  | { type: "ANALYZING" }
  | { type: "JOB_SNAPSHOT"; job: ImportJobDoc }
  | {
      type: "PREVIEW_LOADED";
      preview: ImportPreviewDoc;
      mapping: MappingRow[];
      defaultCountry?: string;
      countrySource?: "organization" | "none";
    }
  | { type: "SET_TARGET"; source: string; target: string; transform: MappingRow["transform"] }
  | { type: "SET_TRANSFORM"; source: string; transform: MappingRow["transform"] }
  | { type: "SET_POLICY"; policy: DuplicatePolicy }
  | { type: "SET_COUNTRY"; country: string }
  | { type: "SET_CONSENT"; consent: boolean }
  | { type: "DRY_RUN"; result: DryRunDoc }
  | { type: "GO_REVIEW" }
  | { type: "GO_MAPPING" };

export function stepFromJob(
  job: ImportJobDoc | null,
  clientStep: "mapping" | "review",
  analyzing: boolean,
): WizardStep {
  if (!job) {
    return analyzing ? "analyzing" : "upload";
  }
  if (job.status === "uploaded") {
    return analyzing ? "analyzing" : "upload";
  }
  if (job.status === "scanning" || job.status === "validating") {
    return "analyzing";
  }
  if (job.status === "mapping") {
    return clientStep === "review" ? "review" : "mapping";
  }
  return "progress";
}

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "RESET":
      return { ...initialWizardState };
    case "FILE_CHOSEN":
      return { ...state, fileName: action.fileName, uploadPercent: 0 };
    case "UPLOAD_STARTED":
      return { ...state, uploading: true };
    case "UPLOAD_PROGRESS":
      return { ...state, uploadPercent: action.percent, uploading: true };
    case "UPLOAD_FINISHED":
      return { ...state, uploading: false };
    case "ANALYZING":
      return {
        ...state,
        analyzing: true,
        uploading: false,
        step: "analyzing",
      };
    case "JOB_SNAPSHOT": {
      const job = action.job;
      const analyzing =
        state.analyzing || job.status === "scanning" || job.status === "validating";
      const clientStep =
        job.status === "mapping" ? state.clientStep : state.clientStep;
      return {
        ...state,
        job,
        analyzing: job.status === "mapping" || job.status === "queued" || job.status === "processing"
          ? false
          : analyzing,
        fileName: state.fileName ?? job.file.fileName,
        step: stepFromJob(job, clientStep, analyzing),
      };
    }
    case "PREVIEW_LOADED":
      return {
        ...state,
        preview: action.preview,
        mapping: action.mapping,
        defaultCountry:
          state.countrySource === "user"
            ? state.defaultCountry
            : (action.defaultCountry ?? state.defaultCountry),
        countrySource: action.countrySource ?? state.countrySource,
        dryRun: null,
        step: "mapping",
        clientStep: "mapping",
        analyzing: false,
      };
    case "SET_TARGET":
      return {
        ...state,
        mapping: state.mapping.map((row) =>
          row.source === action.source
            ? { ...row, target: action.target, transform: action.transform }
            : row,
        ),
        dryRun: null,
      };
    case "SET_TRANSFORM":
      return {
        ...state,
        mapping: state.mapping.map((row) =>
          row.source === action.source ? { ...row, transform: action.transform } : row,
        ),
        dryRun: null,
      };
    case "SET_POLICY":
      return { ...state, policy: action.policy, dryRun: null };
    case "SET_COUNTRY":
      return { ...state, defaultCountry: action.country.toUpperCase(), countrySource: "user", dryRun: null };
    case "SET_CONSENT":
      return { ...state, consent: action.consent };
    case "DRY_RUN":
      return { ...state, dryRun: action.result };
    case "GO_REVIEW":
      return { ...state, clientStep: "review", step: "review" };
    case "GO_MAPPING":
      return { ...state, clientStep: "mapping", step: "mapping" };
    default:
      return state;
  }
}
