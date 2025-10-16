import ChatBotBuilderInfo from "./chat-bot-builder-info";
import ChatBotBuilderInfoTabs from "./chat-bot-builder-info-tabs";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatBotSchema, type ChatBotFormData } from "@/types";
import { ChatBotEvents, emitter } from "@/events";
import { useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ChatBotService, ToastMessageService } from "@/services";

const defaultValues: ChatBotFormData = {
  name: "",
  description: "",
  knowledge: { type: null },
  conversation: {},
  suggestions: [],
};

export const ChatBotBuilder = () => {
  const { chatBotId } = useParams();
  const chatBotService = new ChatBotService();
  const form = useForm<ChatBotFormData>({
    resolver: zodResolver(chatBotSchema),
    defaultValues,
  });

  const toastMessageService = new ToastMessageService();

  const createChatBotHandler = async (data: ChatBotFormData) => {
    try {
      await chatBotService.createChatBot(data);
    } catch (error) {
      toastMessageService.apiError(error as any);
    }
  };

  const updateChatBotHandler = async (
    chatBotId: string,
    data: ChatBotFormData
  ) => {
    try {
      await chatBotService.updateChatBot(chatBotId, data);
    } catch (error) {
      toastMessageService.apiError(error as any);
    }
  };

  const onSubmit = useCallback(
    (data: ChatBotFormData) => {
      if (chatBotId) {
        updateChatBotHandler(chatBotId, data);
      } else {
        createChatBotHandler(data);
      }
    },
    [chatBotId]
  );

  const onCreate = useCallback(() => {
    form.handleSubmit(onSubmit)();
  }, [form, onSubmit]);

  const onUpdate = useCallback(() => {
    form.handleSubmit(onSubmit)();
  }, [form, onSubmit]);

  useEffect(() => {
    emitter.on(ChatBotEvents.CHATBOT_CREATE, onCreate);
    emitter.on(ChatBotEvents.CHATBOT_UPDATE, onUpdate);

    return () => {
      emitter.off(ChatBotEvents.CHATBOT_CREATE, onCreate);
      emitter.off(ChatBotEvents.CHATBOT_UPDATE, onUpdate);
    };
  }, [onCreate, onUpdate]);

  useEffect(() => {
    if (chatBotId) {
      chatBotService.getChatBotById(chatBotId).then((res) => {
        form.reset(res.data);
      });
    }
  }, [chatBotId]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex h-full w-full flex-col"
      >
        <ChatBotBuilderInfo />
        <ChatBotBuilderInfoTabs />
      </form>
    </FormProvider>
  );
};
