import { CONDITION_FIELDS_VALUES } from "../constants/automation.constants";

export const loadFieldData = async (
  field: string,
  deps: {
    getConfigurationsByType?: (type: string) => Promise<void>;
    getUsers?: () => Promise<{ label: string; key: string }[]>;
  },
) => {
  const config =
    CONDITION_FIELDS_VALUES[field as keyof typeof CONDITION_FIELDS_VALUES];

  if (!config) {
    return [];
  }

  if (config.type === "static") {
    return config.values;
  }

  switch (config.apiKey) {
    case "lead-status":
      return await deps?.getConfigurationsByType?.("lead-status");

    case "conversation-status":
      return await deps?.getConfigurationsByType?.("conversation-status");

    case "users":
      return await deps?.getUsers?.();
  }
};
