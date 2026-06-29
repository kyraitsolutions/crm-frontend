import { User, Workflow } from "lucide-react";
import type { EntityConfig } from "../types/entity.types";

export const ENTITY_CONFIG: Record<string, EntityConfig> = {
  lead: {
    label: "Lead",
    icon: User,
    badge: {
      bg: "bg-violet-50",
      text: "text-violet-700",
      border: "border-violet-200",
    },
  },

  contact: {
    label: "Contact",
    icon: User,
    badge: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
  },

  deal: {
    label: "Deal",
    icon: User,
    badge: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
  },

  task: {
    label: "Task",
    icon: User,
    badge: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
  },

  automation: {
    label: "Automation",
    icon: Workflow,
    badge: {
      bg: "bg-slate-100",
      text: "text-slate-600",
      border: "border-slate-200",
    },
  },

  note: {
    label: "Note",
    icon: User,
    badge: {
      bg: "bg-teal-50",
      text: "text-teal-700",
      border: "border-teal-200",
    },
  },

  email: {
    label: "Email",
    icon: User,
    badge: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
    },
  },

  pipeline: {
    label: "Pipeline",
    icon: User,
    badge: {
      bg: "bg-cyan-50",
      text: "text-cyan-700",
      border: "border-cyan-200",
    },
  },
};
