// activityLogs/config/action.config.ts

import { Pencil, Sparkle } from "lucide-react";
import type { ActionConfig } from "../types/action.types";

export const ACTION_CONFIG: Record<string, ActionConfig> = {
  created: {
    label: "Created",
    icon: Sparkle,

    badge: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },

    timeline: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
  },

  updated: {
    label: "Updated",
    icon: Pencil,

    badge: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },

    timeline: {
      bg: "bg-blue-50",
      text: "text-blue-500",
    },
  },

  deleted: {
    label: "Deleted",
    icon: Pencil,

    badge: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
    },

    timeline: {
      bg: "bg-red-50",
      text: "text-red-500",
    },
  },

  assigned: {
    label: "Assigned",
    icon: Pencil,

    badge: {
      bg: "bg-violet-50",
      text: "text-violet-700",
      border: "border-violet-200",
    },

    timeline: {
      bg: "bg-violet-50",
      text: "text-violet-500",
    },
  },

  unassigned: {
    label: "Unassigned",
    icon: Pencil,

    badge: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },

    timeline: {
      bg: "bg-amber-50",
      text: "text-amber-500",
    },
  },

  status_changed: {
    label: "Status Changed",
    icon: Pencil,

    badge: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },

    timeline: {
      bg: "bg-blue-50",
      text: "text-blue-500",
    },
  },

  archived: {
    label: "Archived",
    icon: Pencil,

    badge: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },

    timeline: {
      bg: "bg-amber-50",
      text: "text-amber-500",
    },
  },

  restored: {
    label: "Restored",
    icon: Pencil,

    badge: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },

    timeline: {
      bg: "bg-emerald-50",
      text: "text-emerald-500",
    },
  },

  merged: {
    label: "Merged",
    icon: Pencil,

    badge: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },

    timeline: {
      bg: "bg-blue-50",
      text: "text-blue-500",
    },
  },
};
