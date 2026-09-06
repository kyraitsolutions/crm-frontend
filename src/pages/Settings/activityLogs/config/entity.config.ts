import {
  Bot,
  Building2,
  FileText,
  Mail,
  MessageCircle,
  Plug,
  Shield,
  User,
  Users,
  Workflow,
} from "lucide-react";
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
    icon: Mail,
    badge: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
    },
  },

  email_campaign: {
    label: "Email campaign",
    icon: Mail,
    badge: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
    },
  },

  email_template: {
    label: "Email template",
    icon: Mail,
    badge: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
    },
  },

  whatsapp_campaign: {
    label: "WhatsApp campaign",
    icon: MessageCircle,
    badge: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
  },

  chatbot: {
    label: "Chatbot",
    icon: Bot,
    badge: {
      bg: "bg-red-50",
      text: "text-red-500",
      border: "border-red-200",
    },
  },

  chatflow: {
    label: "Chat flow",
    icon: Bot,
    badge: {
      bg: "bg-red-50",
      text: "text-red-500",
      border: "border-red-200",
    },
  },

  form: {
    label: "Form",
    icon: FileText,
    badge: {
      bg: "bg-violet-50",
      text: "text-violet-600",
      border: "border-violet-200",
    },
  },

  account: {
    label: "Account",
    icon: Building2,
    badge: {
      bg: "bg-sky-50",
      text: "text-sky-600",
      border: "border-sky-200",
    },
  },

  organization: {
    label: "Organization",
    icon: Building2,
    badge: {
      bg: "bg-sky-50",
      text: "text-sky-600",
      border: "border-sky-200",
    },
  },

  role: {
    label: "Role",
    icon: Shield,
    badge: {
      bg: "bg-slate-100",
      text: "text-slate-600",
      border: "border-slate-200",
    },
  },

  teammember: {
    label: "Team member",
    icon: Users,
    badge: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
    },
  },

  integration: {
    label: "Integration",
    icon: Plug,
    badge: {
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-200",
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

  conversation: {
    label: "Conversation",
    icon: MessageCircle,
    badge: {
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-200",
    },
  },
};
