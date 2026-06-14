import {
  FileText,
  LayoutDashboard,
  Navigation,
  RefreshCcwDot,
  Settings2,
  TrendingUp,
  Webhook,
} from "lucide-react";
import type { WhatsAppTab } from "../types/whatsapp.type";

export const WHATSAPP_TAB_ICONS = {
  overview: LayoutDashboard,
  templates: FileText,
  broadcasts: Navigation,
  automation: RefreshCcwDot,
  analytics: TrendingUp,
  webhooks: Webhook,
  settings: Settings2,
};

export const getIcons = (tab: WhatsAppTab) => WHATSAPP_TAB_ICONS[tab];
