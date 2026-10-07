import type { PermissionSectionConfig } from "./permission-config";

/** Preferred column order in Create Role UI */
export const ACTION_COLUMN_ORDER = [
  "view",
  "create",
  "edit",
  "delete",
  "export",
  "import",
  "send",
] as const;

export const ALL_ACTIONS = [...ACTION_COLUMN_ORDER];

export function actionsForSection(section: PermissionSectionConfig): string[] {
  const set = new Set<string>();
  for (const mod of section.modules) {
    for (const action of mod.actions) set.add(action);
  }
  const ordered = ACTION_COLUMN_ORDER.filter((a) => set.has(a));
  const rest = [...set].filter(
    (a) => !ACTION_COLUMN_ORDER.includes(a as (typeof ACTION_COLUMN_ORDER)[number]),
  );
  return [...ordered, ...rest];
}
