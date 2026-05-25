import React from "react";
import { MessageCircleMore, Bot, Facebook, Phone } from "lucide-react";

import { useDashboardStore } from "../../store/dashboard.store";
import CustomBadge from "../CustomBadge";
import { timeAgo } from "@/utils/date.utils";
import { FaWhatsapp } from "react-icons/fa";

const platformIcons = {
  chatbot: (
    <div className="flex size-8 items-center justify-center rounded-full bg-violet-100">
      <Bot className="size-4 text-violet-600" />
    </div>
  ),

  whatsapp: (
    <div className="flex size-8 items-center justify-center rounded-full bg-green-100">
      <FaWhatsapp className="size-4 text-green-600" />
    </div>
  ),

  facebook: (
    <div className="flex size-8 items-center justify-center rounded-full bg-blue-100">
      <Facebook className="size-4 text-blue-600" />
    </div>
  ),

  default: (
    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100">
      <MessageCircleMore className="h-3 w-3 text-gray-600" />
    </div>
  ),
};

const RecentConversation = () => {
  const { dashboardOverview } = useDashboardStore((state) => state);

  const recentConversations = dashboardOverview?.recentConversations || [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-[15px] font-semibold text-[#111827]">
          Recent Conversations
        </h2>

        <button className="text-[12px] font-medium text-[#2563EB] hover:text-[#1D4ED8]">
          View All Conversations
        </button>
      </div>

      {/* Conversation List */}
      <div>
        {recentConversations.map((conversation, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-6 border-b border-gray-100 px-4 py-3 last:border-0"
          >
            {/* Left Side */}
            <div className="flex flex-1 items-center gap-3">
              {/* Icon */}
              <div className="shrink-0">
                {platformIcons?.[conversation.platform] ||
                  platformIcons.default}
              </div>

              {/* Contact */}
              <h4 className="max-w-28 text-xs shrink-0 truncate font-semibold">
                {conversation.contact}
              </h4>

              {/* Message */}
              <p className="line-clamp-1 flex-1 text-gray-600 text-[12px] font-medium">
                {conversation?.lastMessage?.text?.slice(0, 40)}...
              </p>
            </div>

            {/* Right Side */}
            <div className="grid grid-cols-2 gap-4">
              <span className="whitespace-nowrap text-[11px] text-[#6B7280]">
                {timeAgo(conversation.createdAt)}
              </span>

              <CustomBadge
                variant="status"
                value={conversation.status?.toLowerCase()}
              >
                {conversation.status}
              </CustomBadge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentConversation;
