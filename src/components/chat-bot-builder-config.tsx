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
    <div className="space-y-8 mt-6">
      {/* --- Chatbot Behavior Section --- */}
      <Card className="shadow-sm border border-slate-200 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">
            Chatbot Behavior
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="showTypingIndicator"
                className="font-medium text-slate-700"
              >
                Show Typing Indicator
              </Label>
              <Switch
                className="cursor-pointer"
                id="showTypingIndicator"
                checked={config.showTypingIndicator}
                onCheckedChange={(val) =>
                  setValue(`config.showTypingIndicator`, val, {
                    shouldDirty: true,
                  })
                }
              />
            </div>

            <div>
              <Label
                htmlFor="autoOpenAfterSeconds"
                className="font-medium text-slate-700 mb-1 block"
              >
                Auto Open After (Seconds)
              </Label>
              <Input
                id="autoOpenAfterSeconds"
                type="number"
                min={0}
                className="w-full"
                {...register("config.autoOpenAfterSeconds", {
                  valueAsNumber: true,
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- Branding Section --- */}
      <Card className="shadow-sm border border-slate-200 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">
            Branding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="enableBrandLabel"
                className="font-medium text-slate-700"
              >
                Enable Brand Label
              </Label>
              <Switch
                id="enableBrandLabel"
                checked={config.enableBrandLabel}
                className="cursor-pointer"
                onCheckedChange={(val) =>
                  setValue("config.enableBrandLabel", val, {
                    shouldDirty: true,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="brandLabelText"
                className="font-medium text-slate-700 block"
              >
                Brand Label Text
              </Label>
              <Input
                id="brandLabelText"
                placeholder="e.g. Powered by Kyra Solutions"
                {...register("config.brandLabelText")}
                className="border-gray-300 focus:outline-none! focus:ring-0 "
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="showPoweredBy"
                className="font-medium text-slate-700"
              >
                Show "Powered By" Label
              </Label>
              <Switch
                className="cursor-pointer"
                id="showPoweredBy"
                checked={config.showPoweredBy}
                onCheckedChange={(val) =>
                  setValue("config.showPoweredBy", val, { shouldDirty: true })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- Activation Section --- */}
      <Card className="shadow-sm border border-slate-200 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">
            Chatbot Activation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="active" className="font-medium text-slate-700">
                Active Chatbot
              </Label>
              <Switch
                className="cursor-pointer"
                id="active"
                checked={config.active}
                onCheckedChange={(val) =>
                  setValue("config.active", val, { shouldDirty: true })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
