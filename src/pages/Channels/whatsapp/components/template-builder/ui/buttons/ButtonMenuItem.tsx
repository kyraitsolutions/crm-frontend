import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createButton } from "@/pages/Channels/whatsapp/utils/template/template.utils";
import type { TemplateForm } from "@/pages/Channels/whatsapp/validations/template.schema";
import { Copy, Globe, MessageCircle, Phone, User } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { BUTTON_TYPE_CONFIG } from "../../../../constants/template.constants";
import type { ButtonKind } from "@/pages/Channels/whatsapp/types/templates";

const ICONS = {
  QUICK_REPLY: MessageCircle,
  URL: Globe,
  PHONE_NUMBER: Phone,
  CALL_ON_WHATSAPP: MessageCircle,
  COPY_CODE: Copy,
  SHARE_CONTACT: User,
};

export const ButtonMenuItem = () => {
  // const { buttons, addButton } = useTemplateStore();
  const { setValue, control } = useFormContext<TemplateForm>();

  const buttons = useWatch({ control, name: "buttons" });

  const counts =
    buttons &&
    buttons.reduce<Record<string, number>>((acc, button) => {
      acc[button.kind] = (acc[button.kind] ?? 0) + 1;
      return acc;
    }, {});

  return (
    <div className="py-1">
      {(Object.keys(BUTTON_TYPE_CONFIG) as ButtonKind[]).map((kind) => {
        const config = BUTTON_TYPE_CONFIG[kind];
        const used = (counts && counts[kind as keyof typeof counts]) ?? 0;
        const disabled = used >= config.maxCount;
        const Icon = ICONS[kind as keyof typeof ICONS];

        return (
          <DropdownMenuItem
            key={kind}
            disabled={disabled}
            onClick={() =>
              setValue("buttons", [...(buttons || []), createButton(kind)])
            }
            className="flex cursor-pointer items-start gap-3 px-4 py-3"
          >
            <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">{config.label}</p>
              <p className="text-xs text-muted-foreground">
                {disabled ? "Maximum reached" : config.description}
              </p>
            </div>
          </DropdownMenuItem>
        );
      })}
    </div>
  );
};
