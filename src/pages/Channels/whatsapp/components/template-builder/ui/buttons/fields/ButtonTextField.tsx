import { Input } from "@/components/ui/input";
import { BUTTON_TYPE_CONFIG } from "@/pages/Channels/whatsapp/constants/template.constants";
import { useTemplateStore } from "@/pages/Channels/whatsapp/store/template-builder.store";
import type { TemplateButton } from "@/pages/Channels/whatsapp/types/template.type";

interface IButtonTextFieldProps {
  button: TemplateButton;
}

export function ButtonTextField({ button }: IButtonTextFieldProps) {
  const { updateButton } = useTemplateStore((state) => state);
  const maxLength = 40;

  const config = BUTTON_TYPE_CONFIG[button.kind];

  return (
    <div className="col-span-4 space-y-1.5">
      <label className="text-sm font-medium">Button text</label>

      <div className="relative">
        <Input
          className="input-field pr-14"
          placeholder="Button text"
          maxLength={maxLength}
          disabled={!config.editableLabel}
          value={config.editableLabel ? button.label : config.label}
          onChange={(e) =>
            updateButton(button.id, {
              label: e.target.value,
            })
          }
        />

        {config.editableLabel && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {button.label.length}/{maxLength}
          </span>
        )}
      </div>

      {button.errors?.label && (
        <p className="text-xs text-destructive">{button.errors.label}</p>
      )}
    </div>
  );
}
