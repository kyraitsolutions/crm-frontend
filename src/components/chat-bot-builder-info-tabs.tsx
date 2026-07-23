import type { ChatBotFormData } from "@/types";
import { ArrowDownRight, Cog, Palette, Settings } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import ChatBotBuilderAppearance from "./chat-bot-builder-appearance";
import ChatBotBuilderConfiguration from "./chat-bot-builder-config";
import ChatBotBuilderOverview from "./chat-bot-builder-overview";
import ChatbotIntegration from "./chat-bot-integration";
// import ChatbotPreview from "./chatbot-preview";
import Loader from "./Loader";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAccountAccessStore } from "@/stores/account-access.store";
import { hasPermission, PERMISSIONS } from "@/rbac";
import { CHATBOT_PATHS } from "@/constants/routes";

const notShowTabs = ["integration", "chatbot flow"];

const tabs = [
  { id: "overview", label: "Overview", icon: Settings },
  // { id: "customization", label: "Customization", icon: Sliders },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "configration", label: "Configuration", icon: Cog },
  // { id: "chatbotFlow", label: "Chatbot Flow", icon: Cog },
  // { id: "chatbot-preview", label: "Preview", icon: Cog },
  { id: "integration", label: "Integration", icon: Cog },
];

export default function ChatBotBuilderInfoTabs({
  isFormSubmitting,
}: {
  isFormSubmitting: boolean;
}) {
  const { accountId, chatBotId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const { permissions } = useAccountAccessStore((state) => state);

  const navigate = useNavigate();

  const {
    formState: { isDirty },
  } = useFormContext<ChatBotFormData>();

  // tabs maps for each tab
  const tabsMaps: Record<string, React.ReactNode> = {
    overview: <ChatBotBuilderOverview />,
    // customization: <ChatBotBuilderCustomization />,
    appearance: <ChatBotBuilderAppearance />,
    configration: <ChatBotBuilderConfiguration />,
    // "chatbot-preview": <ChatbotPreview />,
    integration: <ChatbotIntegration setActiveTab={setActiveTab} />,
  };

  return (
    <div className="mt-4 px-4  items-center justify-between ">


      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tabs Header */}
        <TabsList className="flex justify-between w-full flex-wrap h-auto bg-transparent gap-2">
          <div className="flex flex-wrap h-auto bg-transparent gap-2">

            {tabs.map((tab) => {
              if (notShowTabs.includes(tab.label.toLowerCase()) && !chatBotId)
                return null;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={`
            flex items-center gap-2 px-4 py-2 text-sm font-medium
            rounded-xl
            transition-colors
            max-sm:flex-col
            cursor-pointer
            ${activeTab === tab.id
                      ? "bg-primary! text-white shadow shadow-primary"
                      : "text-[#847971] hover:bg-[#F7F6F4] hover:text-[#37322F]"
                    }
          `}
                  onClick={() => {
                    if (tab?.id === "chatbotFlow") {
                      navigate(
                        `${CHATBOT_PATHS.getFlow(accountId as string, chatBotId as string)}`,
                      );
                    }
                  }}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </div>
          <div>

            {isDirty &&
              hasPermission(
                permissions,
                PERMISSIONS.CHATBOTS.CREATE || PERMISSIONS.CHATBOTS.UPDATE,
              ) && (
                <div className="flex justify-end px-4">
                  <Button
                    className="actions-btn px-4! py-2!"
                    type="submit"
                    disabled={isFormSubmitting}
                  >
                    {isFormSubmitting ? (
                      <span className="flex gap-2">
                        Publishing
                        <Loader color="black" />
                      </span>
                    ) : (
                      <span className="flex gap-2">
                        Publish
                        <ArrowDownRight />
                      </span>
                    )}
                  </Button>
                </div>
              )}
          </div >
        </TabsList>

        {/* Tabs Content */}
        <TabsContent value={activeTab}>{tabsMaps[activeTab]}</TabsContent>
      </Tabs>

    </div>

  );
}
