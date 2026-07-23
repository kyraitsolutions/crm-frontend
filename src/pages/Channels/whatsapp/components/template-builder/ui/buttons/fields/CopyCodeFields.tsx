import { Input } from "@/components/ui/input";
import { useTemplateStore } from "@/pages/Channels/whatsapp/store/template-builder.store";
import type { TemplateButton } from "@/pages/Channels/whatsapp/types/template.type";
import React from "react";

interface ICopyCodeFieldsProps {
  button: TemplateButton;
}

export function CopyCodeFields({ button }: ICopyCodeFieldsProps) {
  const { updateButton } = useTemplateStore((state) => state);

  return (
    <React.Fragment>
      {/* Offer Code */}
      <div className="col-span-4 space-y-1.5">
        <label className="text-sm font-medium">Offer code</label>

        <div className="relative">
          <Input
            className="input-field pr-14"
            placeholder="Enter sample"
            value={button.offerCode ?? ""}
            maxLength={20}
            onChange={(e) =>
              updateButton(button.id, {
                offerCode: e.target.value,
              })
            }
          />

          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {button.offerCode?.length ?? 0}/20
          </span>
        </div>

        {button.errors?.offerCode && (
          <p className="text-xs text-destructive">{button.errors.offerCode}</p>
        )}
      </div>
    </React.Fragment>
  );
}
