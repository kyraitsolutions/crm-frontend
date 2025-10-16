"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type SurveyCreateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (value: "scratch" | "ai") => void;
};

export function SurveyCreateModal({
  open,
  onOpenChange,
  onSelect,
}: SurveyCreateModalProps) {
  const [value, setValue] = React.useState<"scratch" | "ai" | "">("");

  const handleNext = () => {
    if (value) {
      onSelect(value);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-lg"
      >
        <DialogHeader>
          <DialogTitle>Create Survey</DialogTitle>
          <DialogDescription>
            Choose how you want to create your survey.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={value}
          onValueChange={(val) => setValue(val as "scratch" | "ai")}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
        >
          <Label
            htmlFor="scratch"
            className={`cursor-pointer rounded-xl border-2 p-2 transition ${
              value === "scratch" ? "border-primary" : "border-muted"
            }`}
          >
            <Card className="w-full h-full py-0">
              <CardContent className="flex flex-col items-start gap-2 p-4">
                <div className="flex space-x-2 items-center">
                  <RadioGroupItem value="scratch" id="scratch" />
                  <span className="text-sm font-medium">From Scratch</span>
                </div>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxqake0JNYed1ZwpcT6NZZ3Eq0YaJQTJsoRQ&s"
                  alt="From Scratch"
                  className="rounded-md w-full h-full object-cover"
                />
              </CardContent>
            </Card>
          </Label>

          <Label
            htmlFor="ai"
            className={`cursor-pointer rounded-xl border-2 p-2 transition ${
              value === "ai" ? "border-primary" : "border-muted"
            }`}
          >
            <Card className="w-full h-full py-0">
              <CardContent className="flex flex-col items-start gap-2 p-4">
                <div className="flex space-x-2 items-center">
                  <RadioGroupItem value="ai" id="ai" />
                  <span className="text-sm font-medium">Use AI</span>
                </div>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxqake0JNYed1ZwpcT6NZZ3Eq0YaJQTJsoRQ&s"
                  alt="AI Generated"
                  className="rounded-md  w-full  h-full object-cover"
                />
              </CardContent>
            </Card>
          </Label>
        </RadioGroup>

        <div className="flex justify-end mt-6">
          <Button disabled={!value} onClick={handleNext}>
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
