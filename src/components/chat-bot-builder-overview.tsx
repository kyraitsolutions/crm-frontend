import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Circle } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import type { ChatBotFormData } from "@/types";
// import { useState } from "react";

const instructions = [
  "Enter the bot name and a short description",
  "Customize the flow and initial message for you guest",
  "Cusotmize chatbot design and position as per your brand",
  "Manage chatbot behaviour and active time of chatbot",
  "Copy and integrate scripts in your website code",
];

export default function ChatBotBuilderOverview() {
  const { control } = useFormContext<ChatBotFormData>();

  return (
    <section className="grid gap-8 w-full">
      <div className="space-y-0">
        {/* BASIC INFORMATION */}
        <Card className="border-none shadow-none bg-transparent px-2">
          <CardHeader className="px-0 pb-0">
            <CardTitle className="text-xl font-medium text-[#37322F]">
              Basic Information
            </CardTitle>
          </CardHeader>

          <CardContent className="px-0 space-y-6">
            <div>
              <Label className="text-sm font-medium text-[#37322F]">
                Chatbot name <span className="text-red-500">*</span>
              </Label>

              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Ex: YouWare Concierge"
                    className="
                  mt-2
                  h-11
                  bg-[#F7F6F4]
                  border-none
                  rounded-lg
                  text-[#37322F]
                  placeholder:text-[#847971]
                  focus-visible:ring-0
                "
                  />
                )}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-[#37322F]">
                Description
              </Label>

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    rows={4}
                    placeholder="Summarize what your chatbot helps with..."
                    className="
                  mt-2
                  bg-[#F7F6F4]
                  border-none
                  rounded-lg
                  resize-none
                  text-[#37322F]
                  placeholder:text-[#847971]
                  focus-visible:ring-0
                "
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* QUICK SETUP CHECKLIST */}
        <Card className="border-none shadow-none bg-transparent px-2">
          <CardHeader className="px-0 pb-2">
            <CardTitle className="text-xl font-medium text-[#37322F] flex items-center gap-2">
              Quick setup checklist
            </CardTitle>
            <CardDescription className="text-[#847971]">
              Follow these tips to create an effective chatbot
            </CardDescription>
          </CardHeader>

          <CardContent className="px-0">
            <div className="grid gap-4 text-sm">
              {instructions.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`
                  mt-0.5 flex h-5 w-5 items-center justify-center rounded-full
                  ${index < 2
                        ? "bg-[rgba(55,50,47,0.10)]"
                        : "border border-[rgba(55,50,47,0.20)]"
                      }
                `}
                  >
                    {index < 2 ? (
                      <CheckCircle2 className="h-3 w-3 text-[#37322F]" />
                    ) : (
                      <Circle className="h-3 w-3 text-[#847971]" />
                    )}
                  </div>

                  <span
                    className={
                      index < 2
                        ? "text-[#37322F]"
                        : "text-[#847971]"
                    }
                  >
                    {tip}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>


  );
}
