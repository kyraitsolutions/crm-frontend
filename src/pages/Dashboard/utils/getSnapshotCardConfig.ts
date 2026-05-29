import { Bot, MessageCircle, Users, type LucideIcon } from "lucide-react";

type SnapshotConfig = {
  icon: LucideIcon;

  iconBg: string;
  iconColor: string;

  cardBg: string;

  actionColor: string;
};

export const SNAPSHOT_CONFIG: Record<string, SnapshotConfig> = {
  crm: {
    icon: Users,
    iconBg: "bg-green-100",
    iconColor: "text-green-700",
    cardBg: "bg-white",
    actionColor: "text-green-600",
  },

  chatbot: {
    icon: Bot,

    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",

    cardBg: "bg-white",

    actionColor: "text-blue-600",
  },

  whatsapp: {
    icon: MessageCircle,

    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",

    cardBg: "bg-white",

    actionColor: "text-emerald-600",
  },

  default: {
    icon: Users,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    cardBg: "bg-white",
    actionColor: "text-gray-600",
  },
};

export const getSnapshotConfig = (id: string) => {
  return SNAPSHOT_CONFIG[id] || SNAPSHOT_CONFIG.default;
};
