import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TTemplateButton } from "@/pages/Channels/whatsapp/types/templates";
import { ButtonCard } from "../ButtonCard";
import { useTemplateButtons } from "../buttons-field.context";

interface IQuickReplyButtonProps {
  button: TTemplateButton;
}

export function QuickReplyButtonEditor({ button }: IQuickReplyButtonProps) {
  const { removeButton, updateButton } = useTemplateButtons();

  return (
    <ButtonCard onDelete={() => removeButton(button.id)}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Type</label>

          <Select value="CUSTOM" onValueChange={() => {}}>
            <SelectTrigger className="input-field w-full rounded-xl!">
              <SelectValue />
            </SelectTrigger>

            <SelectContent className="rounded-xl!">
              <SelectItem value="CUSTOM">Custom</SelectItem>
              <SelectItem value="PRE_CONFIGURED">
                Pre-configured response
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Button text
          </label>

          <div className="relative">
            <Input
              value={button.label}
              maxLength={25}
              placeholder="Quick Reply"
              className="input-field rounded-xl! pr-14"
              onChange={(e) =>
                updateButton(button.id, {
                  label: e.target.value,
                })
              }
            />

            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {button.label.length}/25
            </span>
          </div>

          {button.errors?.label && (
            <p className="text-xs text-destructive">{button.errors.label}</p>
          )}
        </div>
      </div>
    </ButtonCard>
  );
}
