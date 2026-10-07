import { Whatsapp } from "@/icons/icons";
import {
  MessageCircleMore,
  Settings,
  SquareCheckBig,
  // Bot,
  Layers,
  SquareUserRound,
  AtSign,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type Items = {
  url: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
};

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname.split("/").at(-1);

  const items: Items[] = [
    {
      url: "overview",
      label: "Business Profile",
      icon: <SquareUserRound size={15} />,
      active: path === "overview",
    },
    {
      url: "template-messages",
      label: "Template Messages",
      icon: <Layers size={15} />,
      active: path === "template-messages",
    },
    {
      url: "optin",
      label: "Optin Management",
      icon: <SquareCheckBig size={15} />,
      active: path === "optin",
    },
    {
      url: "chat-setting",
      label: "Live Chat Setting",
      icon: <MessageCircleMore size={15} />,
      active: path === "chat-setting",
    },
    // {
    //   url: "ai-agent",
    //   label: "AI Sales Agent",
    //   icon: <Bot size={15} />,
    //   active: path === "ai-agent",
    // },
    {
      url: "canned-messages",
      label: "Canned Message",
      icon: <AtSign size={15} />,
      active: path === "canned-messages",
    },
    {
      url: "setting",
      label: "Settings",
      icon: <Settings size={15} />,
      active: path === "setting",
    },
  ];

  return (
    <aside className="w-56 shrink-0 h-[calc(100vh-64px)] overflow-y-auto flex flex-col border-r border-gray-200/70 bg-white">
      <div className="border-b border-gray-200/70 px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-primary">
            <Whatsapp h="18px" w="18px" />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-xs uppercase tracking-wide truncate">
              Whatsapp
            </h2>
            <p className="text-[11px] text-gray-500 truncate">Conversations</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-0.5">
        {items.map((item) => (
          <Link
            key={item.label}
            to={`/dashboard/settings/whatsapp/${item.url}`}
            className={`flex w-full items-center gap-2.5 rounded-lg text-sm transition-colors px-2.5 py-4 ${
              item.active
                ? "bg-primary/10 text-primary font-semibold border-r-4 border-primary"
                : "text-slate-600 hover:bg-gray-50 hover:text-slate-900"
            }`}
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
