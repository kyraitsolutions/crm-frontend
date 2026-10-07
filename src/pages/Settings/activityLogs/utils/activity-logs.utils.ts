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
import { getEntityConfig } from "./entity.utils";
import { getFieldLabel } from "./field.utils";

const ENTITY_NAME_KEYS: Record<string, string[]> = {
  lead: ["leadName", "name"],
  contact: ["name", "email", "phone"],
  deal: ["dealName", "name"],
  automation: ["automationName", "name"],
  task: ["title", "name"],
  integration: ["provider"],
  role: ["roleName", "name"],
  account: ["accountName", "name"],
  organization: ["name"],
  form: ["name"],
  chatbot: ["name"],
  chatflow: ["name"],
  email: ["name", "subject"],
  email_campaign: ["campaignName", "name"],
  email_template: ["name"],
  teammember: ["name", "email"],
};

const PROVIDER_LABELS: Record<string, string> = {
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  google: "Google",
  gmail: "Gmail",
};

const FALLBACK_NAME_KEYS = ["name", "title", "leadName", "provider", "email"];

function metadataText(
  metadata: Record<string, unknown> | undefined,
  key: string,
): string {
  const value = metadata?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function formatProvider(value: string): string {
  const known = PROVIDER_LABELS[value.toLowerCase()];
  if (known) return known;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getEntityName(log: ActivityLog): string {
  const keys = ENTITY_NAME_KEYS[log.entityType] ?? FALLBACK_NAME_KEYS;

  for (const key of keys) {
    const value = metadataText(log.metadata, key);
    if (!value) continue;
    return key === "provider" ? formatProvider(value) : value;
  }

  return getEntityConfig(log.entityType).label;
}

export function hasDisplayableChanges(log: ActivityLog): boolean {
  return Object.keys(log.changes).some((key) => !SKIP_CHANGE_KEYS.has(key));
}

function changeSideLabel(value: unknown): string {
  if (value == null || value === "") return "None";
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.label === "string" && obj.label.trim()) return obj.label;
    if (typeof obj.name === "string" && obj.name.trim()) return obj.name;
    if (typeof obj.email === "string" && obj.email.trim()) return obj.email;
  }
  return String(value);
}

export function getActivitySubtitle(log: ActivityLog): string | null {
  const changes = log.changes || {};

  if (changes.assignedTo) {
    const change = changes.assignedTo;
    return `${changeSideLabel(change?.from)} → ${changeSideLabel(change?.to)}`;
  }

  if (changes.stage) {
    const change = changes.stage;
    return `${changeSideLabel(change?.from)} → ${changeSideLabel(change?.to)}`;
  }

  if (changes.status) {
    const change = changes.status;
    return `${changeSideLabel(change?.from)} → ${changeSideLabel(change?.to)}`;
  }

  if (changes.source) {
    const change = changes.source;
    return `${changeSideLabel(change?.from)} → ${changeSideLabel(change?.to)}`;
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
  // Prefer label/name for enriched refs like { id, label: "Jane Doe" }
  const labeled = getDisplayValue(value);
  if (labeled && !labeled.startsWith("{")) {
    return { type: "primitive", value: labeled };
  }
  return { type: "object", value: labeled };
}
export function getDisplayValue(value: unknown): string {
  if (typeof value !== "object" || value === null) {
    return String(value);
  }
  const obj = value as Record<string, unknown>;
  if (typeof obj.label === "string" && obj.label.trim()) return obj.label;
  if (typeof obj.name === "string" && obj.name.trim()) return obj.name;
  if (typeof obj.title === "string" && obj.title.trim()) return obj.title;
  if (typeof obj.message === "string" && obj.message.trim()) return obj.message;
  if (typeof obj.email === "string" && obj.email.trim()) return obj.email;
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
