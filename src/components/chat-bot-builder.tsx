import { ChatBotService, ToastMessageService } from "@/services";
import { type ApiError, type ChatBotFormData } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import ChatBotBuilderInfo from "./chat-bot-builder-info";
import ChatBotBuilderInfoTabs from "./chat-bot-builder-info-tabs";
import { DASHBOARD_PATH } from "@/constants";
import {
  mandatoryEdges,
  mandatoryNodes,
} from "./chatFlowEditior/ChatbotFlowEditor";

const defaultValues: ChatBotFormData = {
  name: "",
  description: "",
  status: true,
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
  const chatbot = new ChatBotService();
  const { accountId, chatBotId } = useParams();

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toastMessageService = new ToastMessageService();
  // const [defaultValues, setDefaultValues] = useState(defaultValuesState);

  // console.log(chatBotId);

  const chatBotService = new ChatBotService();

  const form = useForm<ChatBotFormData>({
    // resolver: zodResolver(chatBotSchema),
    defaultValues,
  });

  const { handleSubmit, reset } = form;

  const handleFormSubmit = useCallback(
    async (data: any) => {
      try {
        setIsSubmitting(true);
        alert("aaya");

        const response = !chatBotId
          ? await chatBotService?.createChatBot(String(accountId), data)
          : await chatBotService.updateChatBot(
              String(accountId),
              String(chatBotId),
              data
            );

        if (!chatBotId) {
          const chatbotId = response?.data.docs.id;
          createChatbotWithMandatoryNodes(chatbotId);
        }

        if (response.status === 200 || response.status === 201) {
          toastMessageService.apiSuccess(response.message);
          navigate(
            `${DASHBOARD_PATH.getAccountPath(String(accountId))}/chatbot`
          );
        }
      } catch (error) {
        const err = error as ApiError;
        if (err) toastMessageService.apiError(err.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [form.getValues()]
  );

  const createChatbotWithMandatoryNodes = async (chatbotId: string) => {
    const payloadData = {
      nodes: mandatoryNodes,
      edges: mandatoryEdges,
    };
    try {
      await chatbot.createChatBotFlow(
        String(accountId),
        String(chatbotId),
        payloadData
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getChatBotData = async () => {
    try {
      const response = await chatBotService.getChatBotById(
        String(accountId),
        String(chatBotId)
      );

      if (response.status === 200 || response.status === 201) {
        reset(response.data?.docs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (chatBotId) {
      getChatBotData();
    }
  }, [chatBotId]);

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
        <ChatBotBuilderInfoTabs isFormSubmitting={isSubmitting} />
      </form>
    </FormProvider>
  );
};
