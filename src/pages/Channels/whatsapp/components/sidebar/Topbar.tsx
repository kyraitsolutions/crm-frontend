import {
  Compass,
  Clock3,
  Package,
  LoaderCircle,
  CircleCheck,
  AlertCircle,
} from "lucide-react";

const tabs = [
  {
    id: "explore",
    label: "Explore",
    icon: Compass,
  },
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
];

const Topbar = ({
  active,
  onChange,
}: {
  active: string;
  onChange?: (
    id:
      | "explore"
      | "all"
      | "draft"
      | "pending"
      | "approved"
      | "action-required",
  ) => void;
}) => {
  return (
    <div className="w-full border-b bg-white">
      <div className="flex items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChange?.(tab.id as any)}
              className={`relative flex items-center gap-2 px-10 py-4 text-sm font-medium transition-colors ${
                tab.id === active
                  ? "text-teal-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon size={18} strokeWidth={2} />

              <span>{tab.label}</span>

              {tab.id === active && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-teal-700" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Topbar;
