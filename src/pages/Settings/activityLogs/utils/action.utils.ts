import { HelpCircle } from "lucide-react";

import { ACTION_CONFIG } from "../config/action.config";
import type { ActionConfig } from "../types/action.types";

const DEFAULT_ACTION_CONFIG: ActionConfig = {
  label: "Unknown",
  icon: HelpCircle,

  badge: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
  },

  timeline: {
    bg: "bg-gray-100",
    text: "text-gray-600",
  },
};

export function getActionConfig(action: string): ActionConfig {
  return (
    ACTION_CONFIG[action.toLowerCase()] ?? {
      ...DEFAULT_ACTION_CONFIG,
      label: action,
    }
  );
}

export function parseAction(action: string): {
  entity: string;
  verb: string;
} {
  const parts = action.split(".");

  if (parts.length < 2) {
    return {
      entity: action,
      verb: action,
    };
  }

  return {
    entity: parts[0],
    verb: parts.slice(1).join("."),
  };
}
