import { BookOpen, Palette, Settings, Sliders } from "lucide-react";
import { useState } from "react";
import ChatBotBuilderOverview from "./chat-bot-builder-overview";
import ChatBotKnowledge from "./chat-bot-knowledge";
import ChatBotBuilderCustomization from "./chat-bot-builder-customization";
import ChatBotBuilderAppearance from "./chat-bot-builder-appearance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useNavigate } from "react-router-dom";

const tabs = [
  { id: "overview", label: "Overview", icon: Settings },
  { id: "knowledge", label: "Knowledge", icon: BookOpen },
  { id: "customization", label: "Customization", icon: Sliders },
  { id: "appearance", label: "Appearance", icon: Palette },
  {
    id: "chatbot flow",
    label: "Chatbot Flow",
    icon: BookOpen,
  },
];

export default function ChatBotBuilderInfoTabs() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const tabsMaps: Record<string, React.ReactNode> = {
    overview: <ChatBotBuilderOverview />,
    knowledge: <ChatBotKnowledge />,
    customization: <ChatBotBuilderCustomization />,
    appearance: <ChatBotBuilderAppearance />,
  };

  return (
    <div className="p-3 h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              onClick={() => {
                if (tab.label === "Chatbot Flow") {
                  navigate("/chat-bot/builder/5");
                }
              }}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeTab}>{tabsMaps[activeTab]}</TabsContent>
      </Tabs>
    </div>
  );
}
