import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ButtonKind } from "@/pages/Channels/whatsapp/types/templates";
// import { useTemplateStore } from "@/pages/Channels/whatsapp/store/template-builder.store";
import type { TemplateButton } from "@/pages/Channels/whatsapp/types/templates/template.type";

interface Props {
  button: TemplateButton;
}

const CTA_OPTIONS: {
  value: ButtonKind;
  label: string;
}[] = [
  {
    value: "URL",
    label: "Visit website",
  },
  {
    value: "CALL_ON_WHATSAPP",
    label: "Call on WhatsApp",
  },
  {
    value: "PHONE_NUMBER",
    label: "Call Phone Number",
  },
  {
    value: "COPY_CODE",
    label: "Copy offer code",
  },
];

export function TypeOfActionField({ button }: Props) {
  // const { changeButtonKind } = useTemplateStore((state) => state);

  // const counts = CTA_OPTIONS.reduce<Record<string, number>>((acc, button) => {
  //   acc[button.value] = (acc[button.value] ?? 0) + 1;
  //   return acc;
  // }, {});

  return (
    <div className="col-span-3 space-y-1.5">
      <label className="text-sm font-medium">Type of action</label>

      <Select
        value={button.kind}
        // onValueChange={(value) =>
        //   changeButtonKind(button.id, value as ButtonKind)
        // }
      >
        <SelectTrigger className="input-field rounded-xl!">
          <SelectValue />
        </SelectTrigger>

        <SelectContent className="rounded-xl!">
          {CTA_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
