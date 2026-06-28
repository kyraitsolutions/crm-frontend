// activityLogs/utils/activity-log.utils.ts
import { SKIP_CHANGE_KEYS } from "../constants/activity.constants";
import type {
  ActivityLog,
  DiffItem,
  DisplayableChange,
  FieldChange,
  FormattedChangeValue,
} from "../types/activity-log.type";
import { getActionConfig, parseAction } from "./action.utils";
import { getFieldLabel } from "./field.utils";

export function getEntityName(log: ActivityLog): string {
  const metadata = log.metadata;

  return (
    (metadata.leadName as string) ||
    (metadata.contactName as string) ||
    (metadata.dealName as string) ||
    (metadata.automationName as string) ||
    (metadata.name as string) ||
    log.entityType
  );
}

export function hasDisplayableChanges(log: ActivityLog): boolean {
  return Object.keys(log.changes).some((key) => !SKIP_CHANGE_KEYS.has(key));
}

export function getActivitySubtitle(log: ActivityLog): string | null {
  const changes = log.changes;

  if ("stage" in changes) {
    const change = changes.stage;
    return `${change.from ?? "None"} → ${change.to ?? "None"}`;
  }

  if ("status" in changes) {
    const change = changes.status;

    return `${change.from ?? "None"} → ${change.to ?? "None"}`;
  }

  if ("notes" in changes) {
    return String(changes.notes.to ?? "");
  }

  if (typeof log.metadata.description === "string") {
    return log.metadata.description;
  }

  return null;
}

export function getActivitySummary(log: ActivityLog): string {
  const { verb } = parseAction(log.action);
  const action = getActionConfig(verb);
  const entityName = getEntityName(log);

  return `${action.label} ${entityName}`;
}

export function getDisplayableChanges(
  changes: Record<string, FieldChange>,
): DisplayableChange[] {
  return Object.entries(changes)
    .filter(([key]) => !SKIP_CHANGE_KEYS.has(key))
    .map(([key, change]) => ({
      key,
      label: getFieldLabel(key),
      change,
      type: key,
    }));
}

export function formatFieldValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

export function formatChangeValue(value: unknown): FormattedChangeValue {
  if (value === null || value === undefined || value === "") {
    return { type: "empty", value: "—" };
  }
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return { type: "primitive", value: String(value) };
  }
  if (value instanceof Date) {
    return { type: "primitive", value: value.toLocaleDateString() };
  }
  if (Array.isArray(value)) {
    return {
      type: "array",
      value: `${value.length} item(s)`,
      items: value.map(getDisplayValue),
    };
  }
  return { type: "object", value: getDisplayValue(value) };
}
export function getDisplayValue(value: unknown): string {
  if (typeof value !== "object" || value === null) {
    return String(value);
  }
  const obj = value as Record<string, unknown>;
  if (typeof obj.name === "string") return obj.name;
  if (typeof obj.title === "string") return obj.title;
  if (typeof obj.label === "string") return obj.label;
  if (typeof obj.message === "string") return obj.message;
  if (typeof obj.email === "string") return obj.email;
  return JSON.stringify(obj);
}
export function diffArray(before: unknown[], after: unknown[]) {
  const beforeMap = new Map(
    before.map((item) => {
      const key = getArrayItemKey(item);

      return [key, item];
    }),
  );

  const afterMap = new Map(
    after.map((item) => {
      const key = getArrayItemKey(item);

      return [key, item];
    }),
  );

  const added: DiffItem[] = [];
  const removed: DiffItem[] = [];

  afterMap.forEach((item, key) => {
    if (!beforeMap.has(key)) {
      added.push({
        key,
        label: getDisplayValue(item),
      });
    }
  });

  beforeMap.forEach((item, key) => {
    if (!afterMap.has(key)) {
      removed.push({
        key,
        label: getDisplayValue(item),
      });
    }
  });

  return {
    added,
    removed,
  };
}
function getArrayItemKey(value: unknown): string {
  if (typeof value !== "object" || value === null) {
    return String(value);
  }

  const obj = value as Record<string, unknown>;

  if (typeof obj.message === "string") {
    return obj.message;
  }

  if (typeof obj.name === "string") {
    return obj.name;
  }

  if (typeof obj.title === "string") {
    return obj.title;
  }

  if (typeof obj.label === "string") {
    return obj.label;
  }

  return JSON.stringify(obj);
}
