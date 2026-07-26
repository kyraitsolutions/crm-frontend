// import { CircleHelp, Info } from "lucide-react";

// import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TemplateButton } from "@/pages/Channels/whatsapp/types/templates/template.type";
import type { TemplateForm } from "@/pages/Channels/whatsapp/validations/template.schema";
import { useFormContext } from "react-hook-form";

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
  // const { updateButton } = useTemplateStore((state) => state);
  const { setValue, getValues } = useFormContext<TemplateForm>();

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
    <div className="col-span-5 ">
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
          <SelectTrigger className="input-field rounded-xl!">
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
