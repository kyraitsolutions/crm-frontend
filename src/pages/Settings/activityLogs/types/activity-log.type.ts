import type { LucideIcon } from "lucide-react";
import type { ActorType } from "./actor.types";

// Activity log types
export interface ActivityActor {
  type: ActorType;
  id: string;
  name: string;
  avatar?: string;
}

export interface FieldChange {
  from?: unknown;
  to?: unknown;
}

export interface ActivityLog {
  id: string;
  actor: ActivityActor;

  organizationId: string;
  accountId: string;

  entityType: string;
  entityId: string;

  action: string;

  changes: Record<string, FieldChange>;

  metadata: Record<string, unknown>;

  createdAt: string;
}

// Styles types
export interface BadgeStyle {
  bg: string;
  text: string;
  border?: string;
}

export interface TimelineStyle {
  bg: string;
  text: string;
}

export interface ConfigBase {
  label: string;
  icon: LucideIcon;
}

// Displayable types
export interface DisplayableChange {
  key: string;
  label: string;
  change: FieldChange;
  type: string;
}

// Change value types
export interface FormattedChangeValue {
  type: "empty" | "primitive" | "object" | "array";
  value: string;
  items?: string[];
}

// Diff types
export interface DiffItem {
  key: string;
  label: string;
}
