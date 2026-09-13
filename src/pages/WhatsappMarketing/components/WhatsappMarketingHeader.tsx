import { NavLink } from "react-router-dom";
import { MdInsights, MdOutlineCampaign } from "react-icons/md";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  end?: boolean;
}

const WhatsappMarketingHeader = () => {
  const NAV_ITEMS: NavItem[] = [
    { label: "Overview", path: ".", icon: MdInsights, end: true },
    { label: "Campaigns", path: "campaigns", icon: MdOutlineCampaign },
  ];

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.end}
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

export default WhatsappMarketingHeader;
