// import { CircleHelp, Info } from "lucide-react";

// import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TemplateButton } from "@/pages/Channels/whatsapp/types/template.type";
import { useTemplateStore } from "@/pages/Channels/whatsapp/store/template-builder.store";

interface IWhatsAppFieldsProps {
  button: TemplateButton;
}

const ACTIVE_FOR_OPTIONS = [
  {
    label: "7 days",
    value: "7_DAYS",
  },
  {
    label: "15 days",
    value: "15_DAYS",
  },
  {
    label: "30 days",
    value: "30_DAYS",
  },
] as const;

export function WhatsAppFields({ button }: IWhatsAppFieldsProps) {
  const { updateButton } = useTemplateStore((state) => state);

  return (
    <div className="col-span-5 ">
      {/* Button Text */}
      {/* <div className="col-span-4 space-y-1.5">
        <label className="text-sm font-medium">Button text</label>

        <div className="relative">
          <Input
            className="input-field pr-14"
            placeholder="Call on WhatsApp"
            maxLength={40}
            value={button.label}
            onChange={(e) =>
              updateButton(button.id, {
                label: e.target.value,
              })
            }
          />

          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {button.label.length}/40
          </span>
        </div>

        {button.errors?.label && (
          <p className="text-xs text-destructive">{button.errors.label}</p>
        )}
      </div> */}

      {/* Active For */}
      <div className="space-y-1">
        <label className="flex items-center gap-1 text-sm font-medium">
          Active for
          {/* <CircleHelp className="h-4 w-4 text-muted-foreground" /> */}
        </label>

        <Select
          value={button.activeFor}
          onValueChange={(value) =>
            updateButton(button.id, {
              activeFor: value as TemplateButton["activeFor"],
            })
          }
        >
          <SelectTrigger className="input-field">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {ACTIVE_FOR_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Info */}
      {/* <div className="col-span-12 rounded-md bg-muted p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground leading-6">
              Turn on calling in the{" "}
              <a href="#" className="text-primary hover:underline">
                WhatsApp Manager portal
              </a>
              . Alternatively, you can use the Phone Number Settings API.
            </p>

            <button
              type="button"
              className="text-sm text-primary hover:underline"
            >
              About calling on WhatsApp
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
}
