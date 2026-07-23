import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTemplateStore } from "@/pages/Channels/whatsapp/store/template-builder.store";
import type { TemplateButton } from "@/pages/Channels/whatsapp/types/template.type";

interface IUrlFieldsProps {
  button: TemplateButton;
}

export function UrlFields({ button }: IUrlFieldsProps) {
  const { updateButton } = useTemplateStore((state) => state);

  const url = button.url ?? "";

  return (
    <>
      {/* URL Type */}
      <div className="col-span-2 space-y-1.5">
        <label className="text-sm font-medium">URL type</label>

        <Select
          value={button.urlType}
          onValueChange={(value) =>
            updateButton(button.id, {
              urlType: value as "STATIC" | "DYNAMIC",
            })
          }
        >
          <SelectTrigger className="input-field">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="STATIC">Static</SelectItem>

            <SelectItem value="DYNAMIC">Dynamic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Website URL */}
      <div className="col-span-3 space-y-1.5">
        <label className="text-sm font-medium">Website URL</label>

        <div className="relative">
          <Input
            className="input-field pr-16"
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
