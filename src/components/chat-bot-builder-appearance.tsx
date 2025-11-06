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
import { Controller, useFormContext, type Path } from "react-hook-form";
import { chatBotAppearanceSections } from "@/constants";
import type { ChatBotFormData } from "@/types";
import React from "react";

type ChatBotFieldPath = Path<ChatBotFormData>;

export default function ChatBotAppearanceEditor() {
  const { control } = useFormContext<ChatBotFormData>();
  // const appearance = watch("theme"); // react-hook-form controlled state

  const fieldGroups = chatBotAppearanceSections;

  const renderField = (field: any) => {
    const fieldPath = `theme.${field.key}` as ChatBotFieldPath;

    switch (field.type) {
      case "color":
        return (
          <Controller
            name={fieldPath}
            control={control}
            render={({ field: f }) => (
              <div className="space-y-2">
                <Label>{field.label}</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={`${f.value}`}
                    onChange={(e) => f.onChange(e.target.value)}
                    className="w-16 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={`${f.value}`}
                    onChange={(e) => f.onChange(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            )}
          />
        );

      case "slider":
        return (
          <Controller
            name={fieldPath}
            control={control}
            render={({ field: f }) => (
              <div className="space-y-2">
                <Label>
                  {field.label}: {f.value}
                  {field.unit || ""}
                </Label>
                <Slider
                  // value={f.value}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  onValueChange={(val) => f.onChange(val[0])}
                />
              </div>
            )}
          />
        );

      case "textarea":
        return (
          <Controller
            name={fieldPath}
            control={control}
            render={({ field: f }) => (
              <div className="space-y-2">
                <Label>{field.label}</Label>
                <textarea
                  className="w-full min-h-[80px] p-2 border rounded-md text-sm"
                  // value={f.value}
                  value={`${f.value}`}
                  onChange={(e) => f.onChange(e.target.value)}
                />
              </div>
            )}
          />
        );

      case "text":
      default:
        return (
          <Controller
            name={fieldPath}
            control={control}
            render={({ field: f }) => (
              <div className="space-y-2">
                <Label>{field.label}</Label>
                <Input
                  type="text"
                  // value={f.value}
                  value={`${f.value}`}
                  onChange={(e) => f.onChange(e.target.value)}
                />
              </div>
            )}
          />
        );
    }
  };

  const CommandSelect = ({ field }: { field: any }) => {
    const fieldPath = `theme.${field.key}` as ChatBotFieldPath;
    return (
      <Controller
        name={fieldPath}
        control={control}
        render={({ field: f }) => {
          const [open, setOpen] = React.useState(false);
          return (
            <div className="space-y-2">
              <Label>{field.label}</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {`${f.value}`}
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
                              f.onChange(option);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                f.value === option ? "opacity-100" : "opacity-0"
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
        }}
      />
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
                {group.fields.map((field: any) => (
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
