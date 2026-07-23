import { Globe, MessageCircle, Phone, Copy, User } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTemplateStore } from "../../../../store/template-builder.store";
import type { ButtonKind } from "../../../../types/template.type";
import { BUTTON_TYPE_CONFIG } from "../../../../constants/template.constants";

const ICONS = {
  QUICK_REPLY: MessageCircle,
  URL: Globe,
  PHONE_NUMBER: Phone,
  CALL_ON_WHATSAPP: MessageCircle,
  COPY_CODE: Copy,
  SHARE_CONTACT: User,
};

export const ButtonMenuItem = () => {
  const { buttons, addButton } = useTemplateStore();

  const counts = buttons.reduce<Record<string, number>>((acc, button) => {
    acc[button.kind] = (acc[button.kind] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="py-1">
      {(Object.keys(BUTTON_TYPE_CONFIG) as ButtonKind[]).map((kind) => {
        const config = BUTTON_TYPE_CONFIG[kind];
        const used = counts[kind] ?? 0;
        const disabled = used >= config.maxCount;
        const Icon = ICONS[kind];

        return (
          <DropdownMenuItem
            key={kind}
            disabled={disabled}
            onClick={() => addButton(kind)}
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
