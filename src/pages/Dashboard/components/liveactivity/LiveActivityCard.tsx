import {
  Bot,
  CheckCircle2,
  Facebook,
  FileText,
  Megaphone,
  MessageCircle,
  UserPlus,
} from "lucide-react";

const activities = [
  {
    id: 1,
    title: "New lead received from Facebook Ads",
    time: "2 min ago",
    icon: <Facebook size={15} className="text-blue-600" />,
    iconBg: "bg-blue-100",
  },

  {
    id: 2,
    title: "John Smith replied on WhatsApp",
    time: "5 min ago",
    icon: <MessageCircle size={15} className="text-green-600" />,
    iconBg: "bg-green-100",
  },

  {
    id: 3,
    title: 'Broadcast "May Offer" sent successfully',
    time: "15 min ago",
    icon: <Megaphone size={15} className="text-orange-600" />,
    iconBg: "bg-orange-100",
  },

  {
    id: 4,
    title: "New contact added: Michael Brown",
    time: "18 min ago",
    icon: <UserPlus size={15} className="text-sky-600" />,
    iconBg: "bg-sky-100",
  },

  {
    id: 5,
    title: "Lead moved to Qualified by Sarah",
    time: "25 min ago",
    icon: <CheckCircle2 size={15} className="text-emerald-600" />,
    iconBg: "bg-emerald-100",
  },

  {
    id: 6,
    title: 'Chatbot flow "Support Bot" triggered',
    time: "30 min ago",
    icon: <Bot size={15} className="text-red-500" />,
    iconBg: "bg-red-100",
  },

  {
    id: 7,
    title: "Form submitted on Contact Us page",
    time: "35 min ago",
    icon: <FileText size={15} className="text-violet-600" />,
    iconBg: "bg-violet-100",
  },
];

const ActivityCard = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Live Activity</h2>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.iconBg}`}
              >
                {activity.icon}
              </div>

              <p className="text-sm text-gray-700 leading-5">
                {activity.title}
              </p>
            </div>

            <span className="text-xs text-gray-400 whitespace-nowrap">
              {activity.time}
            </span>
          </div>
        ))}
      </div>

      <button className="mt-6 text-sm font-medium text-blue-600 hover:text-blue-700">
        View All Activities
      </button>
    </div>
  );
};

export default ActivityCard;
