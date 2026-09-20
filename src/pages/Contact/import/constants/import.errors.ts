export interface ImportErrorCopy {
  message: string;
  action: string;
}

const ERROR_COPY: Record<string, ImportErrorCopy> = {
  IMPORT_FILE_TOO_LARGE: {
    message: "This file is larger than the import limit.",
    action: "Split the file or upload a smaller CSV.",
  },
  IMPORT_UNSUPPORTED_TYPE: {
    message: "That file type is not supported.",
    action: "Upload a .csv or .xlsx file.",
  },
  IMPORT_SIZE_MISMATCH: {
    message: "The uploaded file size does not match what we expected.",
    action: "Start a new import and upload the file again.",
  },
  IMPORT_EMPTY: {
    message: "The uploaded file was not found.",
    action: "Start a new import and upload the file again.",
  },
  IMPORT_SCAN_REJECTED: {
    message: "The file failed the security scan.",
    action: "Export a clean CSV and try again.",
  },
  IMPORT_DEFAULT_COUNTRY_REQUIRED: {
    message: "A default country is required to read phone numbers.",
    action: "Choose a 2-letter country before continuing.",
  },
  IMPORT_INVALID_STATE: {
    message: "This import is not in the right step for that action.",
    action: "Refresh the page. The latest status will load from the server.",
  },
  IMPORT_NOT_FOUND: {
    message: "This import could not be found.",
    action: "Return to import history and open a job from this account.",
  },
  IMPORT_QUOTA_ACTIVE: {
    message: "Too many imports are already running on this account.",
    action: "Wait for an import to finish, or cancel one, then try again.",
  },
  IMPORT_RATE_LIMITED: {
    message: "You have hit an import rate or contact capacity limit.",
    action: "Wait a few minutes, or free contact capacity on your plan, then retry.",
  },
  IMPORT_DRY_RUN_LIMITED: {
    message: "This import has used up its mapping previews for the hour.",
    action: "Set Status to Don’t import unless values are subscribed, unsubscribed, or bounced. Choose a default country, then start a new import to preview again.",
  },
  IMPORT_TENANT_FAIRNESS: {
    message: "This account has reached its share of import capacity.",
    action: "Wait for current imports to finish, then try again.",
  },
  CONTACTS_CREATE_FORBIDDEN: {
    message: "You do not have permission to create contacts.",
    action: "Ask an admin to grant contact create or import access.",
  },
  FEATURE_NOT_AVAILABLE: {
    message: "Contact import is not available on this plan.",
    action: "Upgrade your plan, then try again.",
  },
  IMPORT_UNSUPPORTED_ENCODING: {
    message: "The file encoding is not supported.",
    action: "Save the file as UTF-8 CSV and upload again.",
  },
  IMPORT_ZIP_BOMB: {
    message: "This spreadsheet is too large or compressed unsafely.",
    action: "Save the sheet as a CSV and upload that instead.",
  },
  IMPORT_RESPONSE_INVALID: {
    message: "The server returned an unexpected import response.",
    action: "Refresh and try again. If it continues, contact support.",
  },
  INVALID_PHONE: {
    message: "A phone number could not be read.",
    action: "Use an international number, or set the correct default country.",
  },
  INVALID_EMAIL: {
    message: "An email address is not valid.",
    action: "Fix the email or map that column to Don't import.",
  },
  INVALID_IDENTITY: {
    message: "This row has no usable phone or email.",
    action: "Add an identity column, or remove empty rows.",
  },
  INVALID_STATUS: {
    message: "Contact status only accepts subscribed, unsubscribed, or bounced.",
    action: "Values like open or lead are ignored. Map that column to Don’t import unless it is subscription status.",
  },
  CELL_TOO_LARGE: {
    message: "A cell is larger than the allowed size.",
    action: "Shorten the value or split the file.",
  },
  ROW_TOO_LARGE: {
    message: "A row is larger than the allowed size.",
    action: "Remove extra columns or shorten values.",
  },
  TOO_MANY_COLUMNS: {
    message: "The file has too many columns.",
    action: "Keep only the columns you need to import.",
  },
  DUPLICATE_OTHER_IDENTITY: {
    message: "This row matches another contact on a different identity.",
    action: "Review the sample errors before starting.",
  },
};

const HTTP_FALLBACK: Record<number, ImportErrorCopy> = {
  400: {
    message: "The import request was rejected.",
    action: "Check the file, mapping, and country, then try again.",
  },
  401: {
    message: "Your session expired.",
    action: "Sign in again and restart the import.",
  },
  403: {
    message: "You do not have permission to import contacts.",
    action: "Ask an admin to grant contacts.import.",
  },
  404: {
    message: "This import could not be found.",
    action: "Open the job from import history for this account.",
  },
  409: {
    message: "This import is not in the right step for that action.",
    action: "Refresh. The server status is the source of truth.",
  },
  429: {
    message: "Too many import requests, or contact capacity is full.",
    action: "Wait, then retry. If this is a quota error, free capacity first.",
  },
};

export function importErrorCopy(
  code?: string,
  status?: number,
  fallbackMessage?: string,
): ImportErrorCopy {
  const dryRunLimited =
    fallbackMessage?.toLowerCase().includes("dry-run") ||
    fallbackMessage?.toLowerCase().includes("dry run");
  if (dryRunLimited || code === "IMPORT_DRY_RUN_LIMITED") {
    return ERROR_COPY.IMPORT_DRY_RUN_LIMITED;
  }
  if (code && ERROR_COPY[code]) {
    return ERROR_COPY[code];
  }
  if (status && HTTP_FALLBACK[status]) {
    return HTTP_FALLBACK[status];
  }
  if (fallbackMessage) {
    return {
      message: fallbackMessage,
      action: "Try again, or start a new import.",
    };
  }
  return {
    message: "Something went wrong with this import.",
    action: "Refresh and try again.",
  };
}

export function formatImportError(
  code?: string,
  status?: number,
  fallbackMessage?: string,
): string {
  const copy = importErrorCopy(code, status, fallbackMessage);
  return `${copy.message} ${copy.action}`;
}

export function knownImportErrorCodes(): string[] {
  return Object.keys(ERROR_COPY);
}
