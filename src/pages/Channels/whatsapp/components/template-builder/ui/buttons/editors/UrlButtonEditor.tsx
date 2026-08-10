import { CircleHelp } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ButtonCard } from "../ButtonCard";

import type { TemplateButton } from "@/pages/Channels/whatsapp/types/templates";
import type { TemplateForm } from "@/pages/Channels/whatsapp/validations/template.schema";
import { useFormContext } from "react-hook-form";

interface Props {
  button: TemplateButton;
}

export function UrlButtonEditor({ button }: Props) {
  // const { updateButton, removeButton } = useTemplateStore((state) => state);
  const { getValues, setValue } = useFormContext<TemplateForm>();
  const removeButton = (id: string) => {
    const buttons = getValues("buttons");
    const newButtons = buttons?.filter((button) => button.id !== id);

    setValue("buttons", newButtons);
  };

  const updateButton = (id: string, data: any) => {
    const buttons = getValues("buttons");
    const newButtons = buttons?.map((button) =>
      button.id === id
        ? {
            ...button,
            ...data,
          }
        : button,
    );
    setValue("buttons", newButtons);
  };

  return (
    <ButtonCard onDelete={() => removeButton(button.id)}>
      <div className="space-y-5">
        <div className="grid grid-cols-12 gap-3">
          {/* Type */}
          <div className="col-span-2">
            <label className="mb-1.5 block text-sm font-medium">
              Type of action
            </label>

            <Select value="URL" onValueChange={() => {}}>
              <SelectTrigger className="input-field rounded-xl!">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="rounded-xl!">
                <SelectItem value="URL">Visit website</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Button Text */}
          <div className="col-span-4">
            <label className="mb-1.5 block text-sm font-medium">
              Button text
            </label>

            <div className="relative">
              <Input
                className="input-field pr-16 rounded-xl!"
                maxLength={40}
                value={button.label}
                placeholder="Visit website"
                onChange={(e) =>
                  updateButton(button.id, {
                    label: e.target.value,
                  })
                }
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {button?.label?.length}/40
              </span>
            </div>
          </div>

          {/* URL Type */}
          <div className="col-span-2">
            <label className="mb-1.5 block text-sm font-medium">URL type</label>

            <Select
              value={button.urlType}
              onValueChange={(value) =>
                updateButton(button.id, {
                  urlType: value as "STATIC" | "DYNAMIC",
                })
              }
            >
              <SelectTrigger className="input-field">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="STATIC">Static</SelectItem>

                <SelectItem value="DYNAMIC">Dynamic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Website */}
          <div className="col-span-4">
            <label className="mb-1.5 block text-sm font-medium">
              Website URL
            </label>

            <div className="relative">
              <Input
                className="input-field pr-20"
                value={button?.value}
                maxLength={2000}
                placeholder="https://www.example.com"
                onChange={(e) =>
                  updateButton(button.id, {
                    value: e.target.value as string,
                  })
                }
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {button?.value?.length}/2000
              </span>
            </div>
          </div>
        </div>

        {/* Track Conversion */}
        <div className="flex items-center gap-3 pl-2">
          <Checkbox
            checked={button.trackConversions}
            onCheckedChange={(checked) =>
              updateButton(button.id, {
                trackConversions: !!checked,
              })
            }
          />

          <label className="flex items-center gap-2 text-sm">
            Track app conversions (Marketing Messages API for WhatsApp only)
            <CircleHelp className="h-4 w-4 text-muted-foreground" />
          </label>
        </div>
      </div>
    </ButtonCard>
  );
}
