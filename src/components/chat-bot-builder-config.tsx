"use client";

import { Controller, useFormContext } from "react-hook-form";
import type { ChatBotFormData } from "@/types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export default function ChatBotBuilderConfiguration() {
  const { register, watch, setValue, control } =
    useFormContext<ChatBotFormData>();
  const config = watch("config") ?? {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6 px-2">
      {/* ───────── Chatbot Behavior ───────── */}
      <section className="space-y-6 bg-transparent">
        <h2 className="text-lg font-medium text-[#37322F]">Chatbot Behavior</h2>
        <p className="text-sm text-[#847971]">
          Control how your chatbot behaves on the website
        </p>

        {/* Typing Indicator */}
        <div className="flex items-center justify-between rounded-lg py-4">
          <div className="space-y-1">
            <Label
              htmlFor="showTypingIndicator"
              className="font-medium text-[#37322F]"
            >
              Show Typing Indicator
            </Label>
            <p className="text-sm text-[#847971]">
              Display a typing animation while the bot prepares a response
            </p>
          </div>
          <Switch
            id="showTypingIndicator"
            className="cursor-pointer"
            checked={config.showTypingIndicator}
            onCheckedChange={(val) =>
              setValue("config.showTypingIndicator", val, { shouldDirty: true })
            }
          />
        </div>

        {/* Auto Open */}
        <div className="rounded-lg py-4 space-y-2">
          <Label
            htmlFor="autoOpenAfterSeconds"
            className="font-medium text-[#37322F]"
          >
            Auto Open After (Seconds)
          </Label>
          <p className="text-sm text-[#847971]">
            Automatically open the chatbot after a delay
          </p>

          <Input
            id="autoOpenAfterSeconds"
            type="number"
            min={0}
            {...register("config.autoOpenAfterSeconds", {
              valueAsNumber: true,
            })}
            className="
              mt-1
              h-10
              bg-[#F7F6F4]
              rounded-lg
              border-none
              text-[#37322F]
              placeholder:text-[#847971]
              focus-visible:ring-0
            "
          />
        </div>
      </section>

      {/* ───────── Branding ───────── */}
      <section className="space-y-6 bg-transparent">
        <h2 className="text-lg font-medium text-[#37322F]">Branding</h2>
        <p className="text-sm text-[#847971]">
          Customize how branding appears inside the chatbot
        </p>

        {/* Enable Brand Label */}
        <div className="flex items-center justify-between rounded-lg  py-4">
          <div className="space-y-1">
            <Label
              htmlFor="enableBrandLabel"
              className="font-medium text-[#37322F]"
            >
              Enable Brand Label
            </Label>
            <p className="text-sm text-[#847971]">
              Show your custom brand text in the chatbot footer
            </p>
          </div>
          <Switch
            id="enableBrandLabel"
            className="cursor-pointer"
            checked={config.enableBrandLabel}
            onCheckedChange={(val) =>
              setValue("config.enableBrandLabel", val, { shouldDirty: true })
            }
          />
        </div>

        {/* Brand Text */}
        <div className="rounded-lg  py-4 space-y-2">
          <Label
            htmlFor="brandLabelText"
            className="font-medium text-[#37322F]"
          >
            Brand Label Text
          </Label>
          <p className="text-sm text-[#847971]">
            Example: Powered by Kyra Solutions
          </p>
          <Input
            id="brandLabelText"
            // readOnly
            disabled={!config.showBranding}
            placeholder="e.g. Powered by Kyra Solutions"
            {...register("config.brandLabelText")}
            className="
              mt-1
              h-10
              bg-[#F7F6F4]
              rounded-lg
              border-none
              text-[#37322F]
              placeholder:text-[#847971]
              focus-visible:ring-0
            "
          />
        </div>

        {/* Powered By */}
        <div className="flex items-center justify-between rounded-lg  py-4">
          <div className="space-y-1">
            <Label
              htmlFor="showPoweredBy"
              className="font-medium text-[#37322F]"
            >
              Show “Powered By”
            </Label>
            <p className="text-sm text-[#847971]">
              Display the powered by label below the chatbot
            </p>
          </div>
          <Switch
            id="showPoweredBy"
            className="cursor-pointer"
            checked={config.showBranding}
            onCheckedChange={(val) =>
              setValue("config.showBranding", val, { shouldDirty: true })
            }
          />
        </div>
      </section>

      {/* ───────── Activation ───────── */}
      <section className=" space-y-6 bg-transparent">
        <h2 className="text-lg font-medium text-[#37322F]">
          Chatbot Activation
        </h2>
        <p className="text-sm text-[#847971]">
          Enable or disable the chatbot on your website
        </p>

        <div className="flex items-center justify-between rounded-lg py-4">
          <div className="space-y-1">
            <Label htmlFor="active" className="font-medium text-[#37322F]">
              Active Chatbot
            </Label>
            <p className="text-sm text-[#847971]">
              Turn the chatbot on or off instantly
            </p>
          </div>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="cursor-pointer"
              />
            )}
          />
          {/* <Switch
            id="status"
            className="cursor-pointer"
            checked={statusChatbot}
            onCheckedChange={(val) =>
              setValue("status", val, { shouldDirty: true })
            }
          /> */}
        </div>
      </section>
    </div>
  );
}
