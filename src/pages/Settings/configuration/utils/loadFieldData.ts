import type { ITeam } from "@/types/teams.type";
import { CONDITION_FIELDS_VALUES } from "../constants/automation.constants";

export type FieldOption = { key: string; label: string };

function normalizeOptions(raw: unknown): FieldOption[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item: any) => {
      if (!item) return null;
      if (typeof item === "string") {
        return { key: item, label: item };
      }
      // Configuration values: { key, label }
      if (item.key && item.label) {
        return { key: String(item.key), label: String(item.label) };
      }
      // Team members
      const userId = item.userId || item.id || item._id;
      const name =
        `${item.userProfile?.firstName || item.firstName || ""} ${item.userProfile?.lastName || item.lastName || ""}`.trim();
      if (userId) {
        return {
          key: String(userId),
          label: name || item.email || String(userId),
        };
      }
      return null;
    })
    .filter(Boolean) as FieldOption[];
}

export const loadFieldData = async (
  field: string,
  deps: {
    getConfigurationsByType?: (type: string) => Promise<any>;
    getUsers?: () => Promise<ITeam[]>;
  },
): Promise<FieldOption[]> => {
  const config =
    CONDITION_FIELDS_VALUES[field as keyof typeof CONDITION_FIELDS_VALUES];

  if (!config) return [];

  if (config.type === "text") {
    return [];
  }

  if (config.type === "static") {
    return normalizeOptions(config.values);
  }

  switch (config.apiKey) {
    case "lead_stage": {
      const values = await deps?.getConfigurationsByType?.("lead-status");
      return normalizeOptions(values);
    }
    case "conversation_status": {
      const values = await deps?.getConfigurationsByType?.(
        "conversation-status",
      );
      return normalizeOptions(values);
    }
    case "users": {
      const users = await deps?.getUsers?.();
      return normalizeOptions(users);
    }
    default:
      return [];
  }
};
