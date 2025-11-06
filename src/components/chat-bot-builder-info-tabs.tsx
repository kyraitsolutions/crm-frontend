import type { ChatBotFormData } from "@/types";
import { Cog, Palette, Settings, Sliders } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import ChatBotBuilderAppearance from "./chat-bot-builder-appearance";
import ChatBotBuilderCustomization from "./chat-bot-builder-customization";
import ChatBotBuilderOverview from "./chat-bot-builder-overview";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ChatBotBuilderConfiguration from "./chat-bot-builder-config";

const tabs = [
  { id: "overview", label: "Overview", icon: Settings },
  { id: "customization", label: "Customization", icon: Sliders },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "configration", label: "Configuration", icon: Cog },
];

export default function ChatBotBuilderInfoTabs() {
  const [activeTab, setActiveTab] = useState("overview");
  // const navigate = useNavigate();

  const {
    formState: { isDirty },
  } = useFormContext<ChatBotFormData>();

  // tabs maps for each tab
  const tabsMaps: Record<string, React.ReactNode> = {
    overview: <ChatBotBuilderOverview />,
    customization: <ChatBotBuilderCustomization />,
    appearance: <ChatBotBuilderAppearance />,
    configration: <ChatBotBuilderConfiguration />,
  };

  return (
    <div className="mt-4">
      {isDirty && ( // 👈 Only show when something is typed
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 rounded-full text-white px-6"
          >
            Publish
          </Button>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="cursor-pointer">
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
