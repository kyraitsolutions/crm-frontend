import {
  BadgeCheck,
  ChartNoAxesCombined,
  Clock,
  LayoutDashboard,
  MessageCircle,
  UserCheck,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

type AnalyticsCardConfig = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  lineColor: string;
  fillColor: string;
  strokeColor: string;
  cardBg?: string;
};

export const ANALYTICS_CARD_CONFIG: Record<string, AnalyticsCardConfig> = {
  new_leads: {
    icon: UserPlus,
    iconBg: "bg-green-200/40",
    iconColor: "text-green-600",
    lineColor: "bg-blue-500",
    fillColor: "#00A63E",
    strokeColor: "#00A63E",
    cardBg: "bg-green-50",
  },

  open_conversations: {
    icon: MessageCircle,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    lineColor: "bg-green-500",
    fillColor: "#155DFC",
    strokeColor: "#155DFC",
  },

  conversion_rate: {
    icon: ChartNoAxesCombined,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    lineColor: "bg-purple-500",
    fillColor: "#a855f7",
    strokeColor: "#9333ea",
  },

  converted_leads: {
    icon: BadgeCheck,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    lineColor: "bg-yellow-500",
    fillColor: "#f59e0b",
    strokeColor: "#f59e0b",
  },

  qualified_leads: {
    icon: UserCheck,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    lineColor: "bg-purple-500",
    fillColor: "#a855f7",
    strokeColor: "#9333ea",
  },

  open_leads: {
    icon: Clock,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    lineColor: "bg-yellow-500",
    fillColor: "#f59e0b",
    strokeColor: "#f59e0b",
  },

  default: {
    icon: LayoutDashboard,
    iconBg: "bg-gray-50",
    iconColor: "text-gray-600",
    lineColor: "bg-gray-500",
    fillColor: "#6b7280",
    strokeColor: "#4b5563",
  },
};

export const getAnalyticsCardConfig = (id: string) => {
  return ANALYTICS_CARD_CONFIG[id] || ANALYTICS_CARD_CONFIG.default;
};
