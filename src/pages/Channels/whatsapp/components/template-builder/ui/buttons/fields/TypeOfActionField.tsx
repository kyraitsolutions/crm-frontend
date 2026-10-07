import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUTTON_TYPE_CONFIG } from "@/pages/Channels/whatsapp/constants/template.constants";
import type {
  ButtonKind,
  TTemplateButton,
} from "@/pages/Channels/whatsapp/types/templates";
import { useTemplateButtons } from "../buttons-field.context";

interface Props {
  button: TTemplateButton;
}

const CTA_OPTIONS: {
  value: ButtonKind;
  label: string;
}[] = [
  { value: "URL", label: "Visit website" },
  { value: "CALL_ON_WHATSAPP", label: "Call on WhatsApp" },
  { value: "PHONE_NUMBER", label: "Call Phone Number" },
  { value: "COPY_CODE", label: "Copy offer code" },
];

export function TypeOfActionField({ button }: Props) {
  const { allowedKinds, changeButtonKind, buttons } = useTemplateButtons();

  const options = CTA_OPTIONS.filter((option) => {
    if (allowedKinds === null) return true;
    return allowedKinds.includes(option.value);
  });

  return (
    <div className="col-span-3 space-y-1.5">
      <label className="text-sm font-medium">Type of action</label>

      <Select
        value={button.kind}
        onValueChange={(value) =>
          changeButtonKind(button.id, value as ButtonKind)
        }
      >
        <SelectTrigger className="input-field rounded-xl!">
          <SelectValue />
        </SelectTrigger>

        <SelectContent className="rounded-xl!">
          {options.map((option) => {
            if (option.value === button.kind) {
              return (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              );
            }

            const usedByOthers = buttons.filter(
              (item) => item.id !== button.id && item.kind === option.value,
            ).length;
            const kindMax = BUTTON_TYPE_CONFIG[option.value].maxCount;
            const disabled = usedByOthers >= kindMax;

            return (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={disabled}
              >
                {option.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
