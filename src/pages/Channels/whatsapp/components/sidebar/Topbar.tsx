import {
  // Compass,
  Clock3,
  Package,
  LoaderCircle,
  CircleCheck,
  AlertCircle,
} from "lucide-react";

const tabs = [
  // {
  //   id: "explore",
  //   label: "Explore",
  //   icon: Compass,
  // },
  {
    id: "all",
    label: "All",
    icon: Clock3,
  },
  {
    id: "draft",
    label: "Draft",
    icon: Package,
  },
  {
    id: "pending",
    label: "Pending",
    icon: LoaderCircle,
  },
  {
    id: "approved",
    label: "Approved",
    icon: CircleCheck,
  },
  {
    id: "action-required",
    label: "Action Required",
    icon: AlertCircle,
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Topbar = ({
  active,
  onChange,
}: {
  active: TabId | string;
  onChange?: (id: TabId) => void;
}) => {
  return (
    <div className="w-full border-b border-gray-200 bg-white rounded-xl overflow-hidden">
      <div className="flex items-center gap-1 px-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange?.(tab.id)}
              className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                tab.id === active
                  ? "text-teal-700"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Icon size={16} strokeWidth={2} />
              <span>{tab.label}</span>
              {tab.id === active && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-teal-700" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Topbar;
