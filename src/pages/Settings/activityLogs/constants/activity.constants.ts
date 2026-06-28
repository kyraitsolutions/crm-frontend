import { Pencil, Sparkle, User, type LucideIcon } from "lucide-react";

export interface EntityConfig {
  label: string;
  icon: LucideIcon | string; // Tabler outline icon class
  colorClass: string; // badge background (Tailwind or inline)
  textClass: string;
  borderClass: string;
}

export const ENTITY_CONFIG: Record<string, EntityConfig> = {
  lead: {
    label: "Lead",
    icon: User,
    colorClass: "bg-violet-50",
    textClass: "text-violet-700",
    borderClass: "border-violet-200",
  },
  contact: {
    label: "Contact",
    icon: "ti-address-book",
    colorClass: "bg-blue-50",
    textClass: "text-blue-700",
    borderClass: "border-blue-200",
  },
  deal: {
    label: "Deal",
    icon: "ti-currency-dollar",
    colorClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    borderClass: "border-emerald-200",
  },
  task: {
    label: "Task",
    icon: "ti-checkbox",
    colorClass: "bg-amber-50",
    textClass: "text-amber-700",
    borderClass: "border-amber-200",
  },
  automation: {
    label: "Automation",
    icon: "ti-robot",
    colorClass: "bg-slate-100",
    textClass: "text-slate-600",
    borderClass: "border-slate-200",
  },
  note: {
    label: "Note",
    icon: "ti-note",
    colorClass: "bg-teal-50",
    textClass: "text-teal-700",
    borderClass: "border-teal-200",
  },
  email: {
    label: "Email",
    icon: "ti-mail",
    colorClass: "bg-orange-50",
    textClass: "text-orange-700",
    borderClass: "border-orange-200",
  },
  pipeline: {
    label: "Pipeline",
    icon: "ti-layout-kanban",
    colorClass: "bg-cyan-50",
    textClass: "text-cyan-700",
    borderClass: "border-cyan-200",
  },
};

export function getEntityConfig(entityType: string): EntityConfig {
  return (
    ENTITY_CONFIG[entityType.toLowerCase()] ?? {
      label: entityType,
      icon: "ti-cube",
      colorClass: "bg-gray-100",
      textClass: "text-gray-600",
      borderClass: "border-gray-200",
    }
  );
}

export interface ActionConfig {
  label: string; // e.g. "Updated"
  icon: LucideIcon | string; // Tabler outline icon
  iconBg: string; // Tailwind bg class for the timeline dot
  iconColor: string; // Tailwind text class for the icon
  sentiment: "neutral" | "positive" | "warning" | "danger";
}

export const ACTION_CONFIG: Record<string, ActionConfig> = {
  created: {
    label: "Created",
    icon: Sparkle,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    sentiment: "positive",
  },
  updated: {
    label: "Updated",
    icon: Pencil,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    sentiment: "neutral",
  },
  deleted: {
    label: "Deleted",
    icon: "ti-trash",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    sentiment: "danger",
  },
  assigned: {
    label: "Assigned",
    icon: "ti-user-check",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    sentiment: "positive",
  },
  unassigned: {
    label: "Unassigned",
    icon: "ti-user-minus",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    sentiment: "warning",
  },
  status_changed: {
    label: "Status changed",
    icon: "ti-refresh",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    sentiment: "neutral",
  },
  archived: {
    label: "Archived",
    icon: "ti-archive",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    sentiment: "warning",
  },
  restored: {
    label: "Restored",
    icon: "ti-restore",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    sentiment: "positive",
  },
  merged: {
    label: "Merged",
    icon: "ti-git-merge",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    sentiment: "neutral",
  },
};

export function getActionConfig(verb: string): ActionConfig {
  return (
    ACTION_CONFIG[verb.toLowerCase()] ?? {
      label: verb,
      icon: "ti-activity",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-500",
      sentiment: "neutral",
    }
  );
}

export const SKIP_CHANGE_KEYS = new Set([
  "meta",
  "updatedAt",
  "createdAt",
  "__v",
  "_id",
]);

export const FIELD_LABELS: Record<string, string> = {
  assignedTo: "Assigned to",
  stage: "Stage",
  status: "Status",
  notes: "Notes",
  firstName: "First name",
  lastName: "Last name",
  name: "Name",
  email: "Email",
  phone: "Phone",
  pipeline: "Pipeline",
  dealValue: "Deal value",
  closeDate: "Close date",
  priority: "Priority",
  dueDate: "Due date",
  tags: "Tags",
  source: "Source",
  description: "Description",
};

export function getFieldLabel(key: string): string {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  return key
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

export interface ActorConfig {
  label: string;
  icon: string;
  bg: string;
  text: string;
}

export const ACTOR_CONFIG: Record<string, ActorConfig> = {
  user: {
    label: "User",
    icon: "ti-user",
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  automation: {
    label: "Automation",
    icon: "ti-robot",
    bg: "bg-violet-100",
    text: "text-violet-700",
  },
  system: {
    label: "System",
    icon: "ti-cpu",
    bg: "bg-gray-100",
    text: "text-gray-600",
  },
  api: {
    label: "API",
    icon: "ti-code",
    bg: "bg-amber-100",
    text: "text-amber-700",
  },
};

export function getActorConfig(type: string): ActorConfig {
  return (
    ACTOR_CONFIG[type] ?? {
      label: type,
      icon: "ti-user",
      bg: "bg-gray-100",
      text: "text-gray-600",
    }
  );
}
