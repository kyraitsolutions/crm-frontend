import { User, Bot, Cpu, Code2 } from "lucide-react";

import type { ActorConfig } from "../types/actor.types";

export const ACTOR_CONFIG: Record<string, ActorConfig> = {
  user: {
    label: "User",
    icon: User,

    badge: {
      bg: "bg-blue-100",
      text: "text-blue-700",
    },
  },

  automation: {
    label: "Automation",
    icon: Bot,

    badge: {
      bg: "bg-violet-100",
      text: "text-violet-700",
    },
  },

  system: {
    label: "System",
    icon: Cpu,

    badge: {
      bg: "bg-gray-100",
      text: "text-gray-600",
    },
  },

  api: {
    label: "API",
    icon: Code2,

    badge: {
      bg: "bg-amber-100",
      text: "text-amber-700",
    },
  },
};
