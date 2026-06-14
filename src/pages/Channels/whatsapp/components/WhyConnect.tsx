import { MessageSquare, Send, Zap } from "lucide-react";

const features = [
  {
    title: "Unified Inbox",
    description: "Manage all your WhatsApp conversations in one unified inbox.",
    icon: <MessageSquare size={18} />,
  },
  {
    title: "Smart Automation",
    description: "Automate replies, flows and save time with workflows.",
    icon: <Zap size={18} />,
  },
  {
    title: "Broadcast Campaigns",
    description: "Send updates, offers and notifications at scale instantly.",
    icon: <Send size={18} />,
  },
];

export default function WhyConnect() {
  return (
    <div className="">
      <p className="text-gray-600 font-semibold text-sm">
        Why Connect WhatsApp?
      </p>

      <div className="grid grid-cols-3 gap-3 mt-5">
        {features.map(({ title, description, icon }) => (
          <div
            key={title}
            className="relative bg-white/3 border border-primary/20 rounded-xl p-3.5 backdrop-blur-md overflow-hidden"
          >
            {/* top sheen */}
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
            <div className="size-10 rounded-xl bg-primary/5 text-primary border border-primary/20 flex items-center justify-center mb-2.5">
              {icon}
            </div>
            <p className="text-gray-400 text-sm font-semibold mb-1 leading-snug">
              {title}
            </p>
            <p className="text-gray-600 text-xs leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
