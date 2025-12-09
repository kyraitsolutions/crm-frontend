import type { ChatBotFormData } from "@/types";
import { ArrowDownRight, Cog, Palette, Settings, Sliders } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import ChatBotBuilderAppearance from "./chat-bot-builder-appearance";
import ChatBotBuilderConfiguration from "./chat-bot-builder-config";
import ChatBotBuilderCustomization from "./chat-bot-builder-customization";
import ChatBotBuilderOverview from "./chat-bot-builder-overview";
import Loader from "./Loader";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import { DASHBOARD_PATH } from "@/constants";
import ChatbotIntegration from "./chat-bot-integration";

const tabs = [
  { id: "overview", label: "Overview", icon: Settings },
  { id: "customization", label: "Customization", icon: Sliders },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "configration", label: "Configuration", icon: Cog },
  { id: "chatbotFlow", label: "Chatbot Flow", icon: Cog },
  { id: "integration", label: "Integration", icon: Cog }
];

export default function ChatBotBuilderInfoTabs({
  isFormSubmitting,
}: {
  isFormSubmitting: boolean;
}) {
  const { accountId, chatBotId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const {
    formState: { isDirty },
  } = useFormContext<ChatBotFormData>();

  // tabs maps for each tab
  const tabsMaps: Record<string, React.ReactNode> = {
    overview: <ChatBotBuilderOverview />,
    customization: <ChatBotBuilderCustomization />,
    appearance: <ChatBotBuilderAppearance />,
    configration: <ChatBotBuilderConfiguration />,
    integration: <ChatbotIntegration />,
    // chatbotFlow: <ChatbotFlowEditor />,
  };

  return (
    <div className="mt-4">
      {isDirty && (
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isFormSubmitting}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-green-600 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-300 "
          >
            {isFormSubmitting ? (
              <div className="flex items-center gap-1.5">
                <span>Publishing...</span>
                <Loader size={18} color="#331a54" />
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span>Publish</span>
                <ArrowDownRight />
              </div>
            )}
          </Button>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {tabs.map((tab) => {
            if (tab.label.toLowerCase() === "chatbot flow" && !chatBotId)
              return null;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="cursor-pointer"
                onClick={() => {
                  if (tab?.id === "chatbotFlow") {
                    navigate(
                      `${DASHBOARD_PATH?.getAccountPathChatbot(
                        String(accountId),
                        chatBotId
                      )}${DASHBOARD_PATH?.CHATBOT_BUILDER_FLOW}`
                    );
                  }
                }}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={activeTab}>{tabsMaps[activeTab]}</TabsContent>
      </Tabs>
    </div>
  );
}
