import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TTemplateButton } from "@/pages/Channels/whatsapp/types/templates";
import { useTemplateButtons } from "../buttons-field.context";

interface IUrlFieldsProps {
  button: TTemplateButton;
}

export function UrlFields({ button }: IUrlFieldsProps) {
  const { updateButton } = useTemplateButtons();
  const url = button.url ?? "";

  return (
    <>
      <div className="col-span-2 space-y-1.5">
        <label className="text-sm font-medium">URL type</label>

        <Select
          value={button.urlType || "STATIC"}
          onValueChange={(value) =>
            updateButton(button.id, {
              urlType: value as "STATIC" | "DYNAMIC",
            })
          }
        >
          <SelectTrigger className="input-field rounded-xl!">
            <SelectValue />
          </SelectTrigger>

          <SelectContent className="rounded-xl!">
            <SelectItem value="STATIC">Static</SelectItem>
            <SelectItem value="DYNAMIC">Dynamic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-3 space-y-1.5">
        <label className="text-sm font-medium">Website URL</label>

        <div className="relative">
          <Input
            className="input-field pr-16 rounded-xl!"
            placeholder="https://www.example.com"
            maxLength={2000}
            value={url}
            onChange={(e) =>
              updateButton(button.id, {
                url: e.target.value,
              })
            }
          />

          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {url.length}/2000
          </span>
        </div>

        {button.errors?.url && (
          <p className="text-xs text-destructive">{button.errors.url}</p>
        )}
      </div>
    </>
  );
}
