// activityLogs/utils/entity.utils.ts

import { HelpCircle } from "lucide-react";

import { ENTITY_CONFIG } from "../config/entity.config";
import type { EntityConfig } from "../types/entity.types";

const DEFAULT_ENTITY_CONFIG: EntityConfig = {
  label: "Unknown",
  icon: HelpCircle,

  badge: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
  },
};

export function getEntityConfig(entityType: string): EntityConfig {
  return (
    ENTITY_CONFIG[entityType.toLowerCase()] ?? {
      ...DEFAULT_ENTITY_CONFIG,
      label: entityType,
    }
  );
}
