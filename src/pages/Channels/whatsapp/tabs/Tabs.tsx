import { Button } from "@/components/ui/button";
import { useWhatsAppStore } from "../store/whatsapp.store";
import type { WhatsAppTab } from "../types/whatsapp.type";
import { TABS } from "../constants/whatsapp.constants";
import { getIcons } from "../utils/whatsapp.utils";

export function Tabs() {
  const { activeTab, setActiveTab } = useWhatsAppStore((state) => state);

  return (
    <div className="border-b border-white/[0.07] bg-slate-900 w-full rounded-xl">
      <div className="flex items-stretch overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = getIcons(tab.key as WhatsAppTab);
          const isActive = activeTab === tab.key;

          return (
            <Button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as WhatsAppTab)}
              className={`relative flex items-center gap-1 px-8! py-4 text-sm font-medium tracking-wide whitespace-nowrap border-b-2 bg-transparent
                ${
                  isActive
                    ? "text-white border-primary bg-primary/10!"
                    : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/4"
                }
              `}
            >
              <Icon size={15} />
              {tab.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

// import {
//   LayoutDashboard,
//   FileText,
//   Navigation,
//   RefreshCcwDot,
//   TrendingUp,
//   Webhook,
//   Settings2,
// } from "lucide-react";

// export type WhatsAppTab =
//   | "overview"
//   | "templates"
//   | "broadcasts"
//   | "automation"
//   | "analytics"
//   | "webhooks"
//   | "settings";

// export interface WhatsAppTabsProps {
//   activeTab: WhatsAppTab;
//   onChange: (tab: WhatsAppTab) => void;
// }

// const tabs = [
//   { key: "overview", label: "Overview", icon: LayoutDashboard },
//   { key: "templates", label: "Templates", icon: FileText },
//   { key: "broadcasts", label: "Broadcasts", icon: Navigation },
//   { key: "automation", label: "Automation", icon: RefreshCcwDot },
//   { key: "analytics", label: "Analytics", icon: TrendingUp },
//   { key: "webhooks", label: "Webhooks", icon: Webhook },
//   { key: "settings", label: "Settings", icon: Settings2 },
// ] satisfies { key: WhatsAppTab; label: string; icon: React.ElementType }[];

// export function Tabs({ activeTab, onChange }: WhatsAppTabsProps) {
//   return (
//     <div className="border-white/[0.07] bg-slate-900 w-full">
//       <div className="flex items-stretch overflow-x-auto">
//         {tabs.map((tab) => {
//           const Icon = tab.icon;
//           const isActive = activeTab === tab.key;

//           return (
//             <button
//               key={tab.key}
//               onClick={() => onChange(tab.key)}
//               className={`
//                 relative flex items-center gap-1.5 px-4 py-3.5
//                 text-[13px] font-medium tracking-wide whitespace-nowrap
//                 -mb-px border-b-2 transition-colors
//                 ${
//                   isActive
//                     ? "text-primary"
//                     : "text-[#6b7a99] border-transparent hover:text-slate-400"
//                 }
//               `}
//             >
//               <Icon size={15} />
//               {tab.label}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
