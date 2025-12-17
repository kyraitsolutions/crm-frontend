"use client";

import { useFormContext } from "react-hook-form";
import type { ChatBotFormData } from "@/types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function ChatBotBuilderConfiguration() {
  const { register, watch, setValue } = useFormContext<ChatBotFormData>();
  const config = watch("config");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
      {/* ───────── Chatbot Behavior ───────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Chatbot Behavior</CardTitle>
          <p className="text-sm text-muted-foreground">
            Control how your chatbot behaves on the website
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Typing Indicator */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <Label htmlFor="showTypingIndicator" className="font-medium">
                Show Typing Indicator
              </Label>
              <p className="text-sm text-muted-foreground">
                Display a typing animation while the bot prepares a response
              </p>
            </div>

            <Switch
              id="showTypingIndicator"
              className="cursor-pointer"
              checked={config.showTypingIndicator}
              onCheckedChange={(val) =>
                setValue("config.showTypingIndicator", val, {
                  shouldDirty: true,
                })
              }
            />
          </div>

          {/* Auto Open */}
          <div className="rounded-lg border p-4 space-y-2">
            <Label htmlFor="autoOpenAfterSeconds" className="font-medium">
              Auto Open After (Seconds)
            </Label>
            <p className="text-sm text-muted-foreground">
              Automatically open the chatbot after a delay
            </p>

            <Input
              id="autoOpenAfterSeconds"
              type="number"
              min={0}
              {...register("config.autoOpenAfterSeconds", {
                valueAsNumber: true,
              })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Branding</CardTitle>
          <p className="text-sm text-muted-foreground">
            Customize how branding appears inside the chatbot
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Enable Brand Label */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <Label htmlFor="enableBrandLabel" className="font-medium">
                Enable Brand Label
              </Label>
              <p className="text-sm text-muted-foreground">
                Show your custom brand text in the chatbot footer
              </p>
            </div>

            <Switch
              id="enableBrandLabel"
              className="cursor-pointer"
              checked={config.enableBrandLabel}
              onCheckedChange={(val) =>
                setValue("config.enableBrandLabel", val, {
                  shouldDirty: true,
                })
              }
            />
          </div>

          {/* Brand Text */}
          <div className="rounded-lg border p-4 space-y-2">
            <Label htmlFor="brandLabelText" className="font-medium">
              Brand Label Text
            </Label>
            <p className="text-sm text-muted-foreground">
              Example: Powered by Kyra Solutions
            </p>

            <Input
              id="brandLabelText"
              readOnly
              placeholder="e.g. Powered by Kyra Solutions"
              {...register("config.brandLabelText")}
            />
          </div>

          {/* Powered By */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <Label htmlFor="showPoweredBy" className="font-medium">
                Show “Powered By”
              </Label>
              <p className="text-sm text-muted-foreground">
                Display the powered by label below the chatbot
              </p>
            </div>

            <Switch
              id="showPoweredBy"
              className="cursor-pointer"
              checked={config.showPoweredBy}
              onCheckedChange={(val) =>
                setValue("config.showPoweredBy", val, { shouldDirty: true })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* ───────── Activation ───────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Chatbot Activation</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enable or disable the chatbot on your website
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <Label htmlFor="active" className="font-medium">
                Active Chatbot
              </Label>
              <p className="text-sm text-muted-foreground">
                Turn the chatbot on or off instantly
              </p>
            </div>

            <Switch
              id="active"
              className="cursor-pointer"
              checked={config.active}
              onCheckedChange={(val) =>
                setValue("config.active", val, { shouldDirty: true })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>

  );
}
