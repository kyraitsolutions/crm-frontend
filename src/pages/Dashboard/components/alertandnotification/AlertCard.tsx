import { AlertTriangle, Clock3 } from "lucide-react";

const alerts = [
  {
    id: 1,
    title: "12 leads not replied in 24h",
    action: "View Leads",
    time: "2m ago",
    icon: <AlertTriangle size={15} className="text-red-500" />,
    iconBg: "bg-red-100",
  },

  {
    id: 2,
    title: "WhatsApp token will expire in 3 days",
    action: "Update Now",
    time: "1h ago",
    icon: <Clock3 size={15} className="text-orange-500" />,
    iconBg: "bg-orange-100",
  },

  {
    id: 3,
    title: 'Campaign "Summer Sale" budget is exhausted',
    action: "View Campaign",
    time: "3h ago",
    icon: <Clock3 size={15} className="text-orange-500" />,
    iconBg: "bg-orange-100",
  },

  {
    id: 4,
    title: 'Bot "Product Inquiry" has 2 failed nodes',
    action: "View Bot",
    time: "5h ago",
    icon: <AlertTriangle size={15} className="text-red-500" />,
    iconBg: "bg-red-100",
  },
];

const AlertCard = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 h-full">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Alerts & Notifications
        </h2>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-gray-50 rounded-xl flex items-start justify-between gap-3 p-2"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${alert.iconBg}`}
              >
                {alert.icon}
              </div>

              <div>
                <p className="text-sm text-gray-800 leading-5">{alert.title}</p>

                <button className="text-sm font-medium text-blue-600 mt-1 hover:text-blue-700">
                  {alert.action}
                </button>
              </div>
            </div>

            <span className="text-xs text-gray-400 whitespace-nowrap">
              {alert.time}
            </span>
          </div>
        ))}
      </div>

      <button className="mt-6 text-sm font-medium text-blue-600 hover:text-blue-700">
        View All Alerts
      </button>
    </div>
  );
};

export default AlertCard;
