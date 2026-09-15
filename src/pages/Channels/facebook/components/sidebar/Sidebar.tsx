import { FaFacebook } from "react-icons/fa";
import { LayoutDashboard, Settings } from "lucide-react";
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
      icon: <LayoutDashboard size={16} />,
      active: path === "overview",
    },
    {
      url: "setting",
      label: "Settings",
      icon: <Settings size={16} />,
      active: path === "setting",
    },
  ];

  return (
    <aside className="w-80 h-[calc(100vh-64px)] overflow-y-scroll flex flex-col border-r border-gray-200/70">
      <div className="border-b border-gray-200/70 px-5 py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
            <FaFacebook size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-sm uppercase">Facebook</h2>
            <p className="text-sm">Page & Instagram</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto mt-4 space-y-2">
        {items.map((item) => (
          <Link
            to={item.url}
            key={item.label}
            className={`flex w-full items-center gap-4 rounded-xl text-sm transition px-4 py-3 ${
              item.active
                ? "bg-primary/10 text-primary font-semibold border-r-4 border-primary"
                : "text-slate-700 transition-discrete duration-300"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
