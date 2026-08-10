import { Whatsapp } from "@/icons/icons";
import {
  AtSign,
  Layers,
  MessageCircleMore,
  SquareCheckBig,
  SquareUserRound,
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
  console.log(path);

  const items: Items[] = [
    {
      url: "",
      label: "Business Profile",
      icon: <SquareUserRound size={16} />,
      active: path === "whatsapp" ? true : false,
    },
    {
      url: "template-messages",
      label: "Template Messages",
      icon: <Layers size={16} />,
      active: path === "template-messages" ? true : false,
    },

    {
      url: "optin",
      label: "Optin Management",
      icon: <SquareCheckBig size={16} />,
      active: path === "optin" ? true : false,
    },
    {
      url: "chat-setting",
      label: "Live Chat Setting",
      icon: <MessageCircleMore size={16} />,
      active: path === "chat-setting" ? true : false,
    },
    {
      url: "canned-messages",
      label: "Canned Message",
      icon: <AtSign size={16} />,
      active: path === "canned-messages" ? true : false,
    },
  ];

  return (
    <aside className="w-80 h-[calc(100vh-64px)] overflow-y-scroll  flex flex-col border-r border-gray-200/70">
      {/* Header */}
      <div className="border-b border-gray-200/70 px-5 py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-300/30 text-primary">
            <Whatsapp h="20px" w="20px" />
          </div>

          <div>
            <h2 className="font-semibold text-sm uppercase">Whatsapp</h2>
            <p className="text-sm">Conversations</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 space-y-1.5">
        {items.map((item, index) => (
          <div key={index} className=" px-4 ">
            <Link
              to={item.url}
              key={item.label}
              className={`flex w-full items-center gap-4 rounded-xl px-4 py-2.5 text-sm transition ${
                item.active
                  ? "bg-teal-600/10 text-teal-900 font-"
                  : "text-slate-700 transition-discrete duration-300"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
