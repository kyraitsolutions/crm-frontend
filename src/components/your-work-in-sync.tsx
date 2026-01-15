import type React from "react";

interface KyraChatbotPreviewProps {
  className?: string;
}

const KyraChatbotPreview: React.FC<KyraChatbotPreviewProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`w-[320px] rounded-2xl overflow-hidden border border-gray-200 bg-white ${className}`}
    >
      {/* Header */}
      <div className="bg-[#16A34A] px-4 py-3 flex items-center justify-between">
        <span className="text-white font-semibold text-sm">
          Kyra IT Solutions
        </span>
        <span className="text-white/80 text-lg cursor-pointer">×</span>
      </div>

      {/* Chat Body */}
      <div className="px-4 py-4 space-y-3">
        {/* Bot message */}
        <div className="flex justify-start">
          <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-md px-4 py-2 text-sm text-gray-800">
            Hi there! 👋 Welcome to Kyra IT Solutions.
          </div>
        </div>

        {/* Bot message */}
        <div className="flex justify-start">
          <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-md px-4 py-2 text-sm text-gray-800">
            I’m here to help you with services, pricing, or a quick demo.
          </div>
        </div>

        {/* User message */}
        <div className="flex justify-end">
          <div className="max-w-[85%] bg-[#16A34A] text-white rounded-2xl rounded-tr-md px-4 py-2 text-sm">
            I'm looking for a chatbot for my website.
          </div>
        </div>

        {/* Bot message */}
        <div className="flex justify-start">
          <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-md px-4 py-2 text-sm text-gray-800 ">
            Great choice! 🤖 We build AI-powered chatbots tailored to your business.
          </div>
        </div>

        {/* User message */}
        <div className="flex justify-end">
          <div className="max-w-[85%] bg-[#16A34A] text-white rounded-2xl rounded-tr-md px-4 py-2 text-sm ">
            Can it answer customer questions automatically?
          </div>
        </div>
      </div>
    </div>
  );
};

export default KyraChatbotPreview;
