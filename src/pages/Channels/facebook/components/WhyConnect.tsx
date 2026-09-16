import { Instagram, Megaphone, MessageSquare } from "lucide-react";

const features = [
  {
    title: "Lead Ads Capture",
    description: "Receive Facebook lead form submissions in your CRM instantly.",
    icon: <Megaphone size={18} />,
  },
  {
    title: "Page Inbox",
    description: "Manage Facebook Page conversations from a single workspace.",
    icon: <MessageSquare size={18} />,
  },
  {
    title: "Instagram Linked",
    description: "Connect the Instagram account attached to your Facebook Page.",
    icon: <Instagram size={18} />,
  },
];

export default function WhyConnect() {
  return (
    <div className="">
      <p className="text-gray-600 font-semibold text-sm">
        Why Connect Facebook?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
        {features.map(({ title, description, icon }) => (
          <div
            key={title}
            className="relative bg-white/3 border border-primary/20 rounded-2xl p-3.5 backdrop-blur-md overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
            <div className="size-10 rounded-2xl bg-blue-500/10 text-blue-600 border border-blue-500/20 flex items-center justify-center mb-2.5">
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
