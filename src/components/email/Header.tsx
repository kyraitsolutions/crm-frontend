import { NavLink } from "react-router-dom";
import { MdInsights, MdOutlineCampaign, MdWbAuto, MdOutlineUnsubscribe } from "react-icons/md";
import { FileText, Users } from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const Header = () => {
  const NAV_ITEMS: NavItem[] = [
    { label: "Overview", path: ".", icon: MdInsights },
    { label: "Campaigns", path: "campaigns", icon: MdOutlineCampaign },
    { label: "Templates", path: "templates", icon: FileText },
    { label: "Audiences", path: "audiences", icon: Users },
    // { label: "Unsubscribes", path: "suppression", icon: MdOutlineUnsubscribe },
    // { label: "Automations", path: "automations", icon: MdWbAuto },
  ];

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "."}
                className={({ isActive }) =>
                  `text-sm font-medium flex items-center gap-1 transition-colors ${isActive
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
                  }`
                }
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
