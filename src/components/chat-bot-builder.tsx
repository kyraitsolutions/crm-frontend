import { ChatBotService } from "@/services";
import { type ChatBotFormData } from "@/types";
import { useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import ChatBotBuilderInfo from "./chat-bot-builder-info";
import ChatBotBuilderInfoTabs from "./chat-bot-builder-info-tabs";

const defaultValues = {
  name: "",
  description: "",
  theme: {
    brandColor: "#3b5d50",
    contrastColor: "#fefefe",
    backgroundColor: "#ffffff",
    messageColor: "#f1f5f9",
    userMessageColor: "#3b5d50",
    typeface: "Inter",
    fontSize: 14,
    fontWeight: "normal",
    avatarStyle: "bubble",
    avatarUrl: "",
    showAvatar: true,
    roundedCorners: true,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    widgetPosition: "bottom-right",
    showLauncher: true,
    launcherLabel: "Need product guidance?",
    launcherSize: 56,
    messageAlignment: "left",
    showTimestamps: true,
    animationStyle: "slide",
    shadowIntensity: 20,
    opacity: 100,
    customCSS: "",
  },
  config: {
    showTypingIndicator: false,
    autoOpenAfterSeconds: 5,
    enableBrandLabel: false,
    brandLabelText: "Powered by Kyra Solutions",
    showPoweredBy: false,
    active: false,
  },
};

export const ChatBotBuilder = () => {
  const { accountId } = useParams();

  const chatBotService = new ChatBotService();

  const form = useForm<ChatBotFormData>({
    // resolver: zodResolver(chatBotSchema),
    defaultValues,
  });

  const { handleSubmit } = form;

  const handleFormSubmit = useCallback(
    async (data: any) => {
      try {
        const response = await chatBotService.createChatBot(
          String(accountId),
          data
        );

        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },
    [form.getValues()]
  );

  // const toastMessageService = new ToastMessageService();

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(handleFormSubmit)();
        }}
        className="flex h-full w-full flex-col"
      >
        <ChatBotBuilderInfo />
        <ChatBotBuilderInfoTabs />
      </form>
    </FormProvider>
  );
};
