// activityLogs/utils/actor.utils.ts

import { HelpCircle } from "lucide-react";

import { ACTOR_CONFIG } from "../config/actor.config";
import type { ActorConfig } from "../types/actor.types";

const DEFAULT_ACTOR_CONFIG: ActorConfig = {
  label: "Unknown",
  icon: HelpCircle,

  badge: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
  },
};

export function getActorConfig(type: string): ActorConfig {
  return (
    ACTOR_CONFIG[type.toLowerCase()] ?? {
      ...DEFAULT_ACTOR_CONFIG,
      label: type,
    }
  );
}
