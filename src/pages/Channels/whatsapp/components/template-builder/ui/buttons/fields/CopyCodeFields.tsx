import { Input } from "@/components/ui/input";
import type { TTemplateButton } from "@/pages/Channels/whatsapp/types/templates";
import React from "react";
import { useTemplateButtons } from "../buttons-field.context";

interface ICopyCodeFieldsProps {
  button: TTemplateButton;
}

export function CopyCodeFields({ button }: ICopyCodeFieldsProps) {
  const { updateButton } = useTemplateButtons();

  return (
    <React.Fragment>
      {/* Offer Code */}
      <div className="col-span-4 space-y-1.5">
        <label className="text-sm font-medium">Offer code</label>

        <div className="relative">
          <Input
            className="input-field pr-14 rounded-xl!"
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
