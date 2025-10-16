import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import type { AppearanceState } from "@/types";
import { chatBotAppearanceSections } from "@/constants";

export default function ChatBotAppearanceEditor() {
  const [appearance, setAppearance] = useState<AppearanceState>({
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
    showAvatar: "true",
    roundedCorners: "true",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    widgetPosition: "bottom-right",
    showLauncher: "true",
    launcherLabel: "Need product guidance?",
    launcherSize: 56,
    messageAlignment: "left",
    showTimestamps: "true",
    animationStyle: "slide",
    shadowIntensity: 20,
    opacity: 100,
    customCSS: "",
  });

  const updateAppearance = (key: keyof AppearanceState, value: any) => {
    setAppearance((prev) => ({ ...prev, [key]: value }));
  };

  const fieldGroups = chatBotAppearanceSections;

  const renderField = (field: any) => {
    const value = appearance[field.key as keyof AppearanceState];

    switch (field.type) {
      case "color":
        return (
          <div className="space-y-2">
            <Label>{field.label}</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={value as string}
                onChange={(e) => updateAppearance(field.key, e.target.value)}
                className="w-16 h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={value as string}
                onChange={(e) => updateAppearance(field.key, e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        );

      case "slider":
        return (
          <div className="space-y-2">
            <Label>
              {field.label}: {value}
              {field.unit || ""}
            </Label>
            <Slider
              value={[value as number]}
              min={field.min}
              max={field.max}
              step={field.step}
              onValueChange={(val) => updateAppearance(field.key, val[0])}
            />
          </div>
        );

      case "switch":
        return (
          <div className="flex items-center justify-between gap-4 py-2">
            <Label
              htmlFor={field.key}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </Label>
            {/* <Switch
              id={field.key}
              checked={value as boolean}
              onCheckedChange={(checked) =>
                updateAppearance(field.key, checked)
              }
              className="flex-shrink-0 data-[state=checked]:bg-primary"
            /> */}
            {/* <Checkbox
              id={field.key}
              checked={value as boolean}
              onCheckedChange={(checked) =>
                updateAppearance(field.key, checked)
              }
            /> */}
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-2">
            <Label>{field.label}</Label>
            <textarea
              className="w-full min-h-[80px] p-2 border rounded-md text-sm"
              value={value as string}
              onChange={(e) => updateAppearance(field.key, e.target.value)}
            />
          </div>
        );

      case "text":
      default:
        return (
          <div className="space-y-2">
            <Label>{field.label}</Label>
            <Input
              type="text"
              value={value as string}
              onChange={(e) => updateAppearance(field.key, e.target.value)}
            />
          </div>
        );
    }
  };

  const CommandSelect = ({ field }: { field: any }) => {
    const [open, setOpen] = useState(false);
    const value = appearance[field.key as keyof AppearanceState];

    return (
      <div className="space-y-2">
        <Label>{field.label}</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {value}
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder={`Search ${field.label}...`} />
              <CommandList>
                <CommandEmpty>No option found.</CommandEmpty>
                <CommandGroup>
                  {field.options.map((option: string) => (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={() => {
                        updateAppearance(field.key, option);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          value === option ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {option}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {fieldGroups.map((group, index) => {
        const Icon = group.icon;
        return (
          <Card className="shadow-none" key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                {group.title}
              </CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group.fields.map((field) => (
                  <div
                    key={field.key}
                    className={field.type === "textarea" ? "col-span-2" : ""}
                  >
                    {field.type === "select" ? (
                      <CommandSelect field={field} />
                    ) : (
                      renderField(field)
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
