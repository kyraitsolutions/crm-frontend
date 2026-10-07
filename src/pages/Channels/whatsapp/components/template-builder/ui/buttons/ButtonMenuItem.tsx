import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { BUTTON_TYPE_CONFIG } from "../../../../constants/template.constants";
import type { ButtonKind } from "@/pages/Channels/whatsapp/types/templates";
import { Copy, Globe, MessageCircle, Phone, User } from "lucide-react";
import { useTemplateButtons } from "./buttons-field.context";

const ICONS = {
  QUICK_REPLY: MessageCircle,
  URL: Globe,
  PHONE_NUMBER: Phone,
  CALL_ON_WHATSAPP: MessageCircle,
  COPY_CODE: Copy,
  SHARE_CONTACT: User,
};

export const ButtonMenuItem = () => {
  const { allowedKinds, isKindDisabled, addButton } = useTemplateButtons();

  return (
    <div className="py-1">
      {(Object.keys(BUTTON_TYPE_CONFIG) as ButtonKind[]).map((kind) => {
        const config = BUTTON_TYPE_CONFIG[kind];
        const unsupported =
          allowedKinds !== null && !allowedKinds.includes(kind);
        const disabled = unsupported || isKindDisabled(kind);
        const Icon = ICONS[kind as keyof typeof ICONS];

        return (
          <DropdownMenuItem
            key={kind}
            disabled={disabled}
            onClick={() => {
              if (disabled) return;
              addButton(kind);
            }}
            className="flex cursor-pointer items-start gap-3 px-4 py-3"
          >
            <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">{config.label}</p>
              <p className="text-xs text-muted-foreground">
                {unsupported
                  ? "Not supported for carousel"
                  : disabled
                    ? "Maximum reached"
                    : config.description}
              </p>
            </div>
          </DropdownMenuItem>
        );
      })}
    </div>
  );
};
