import { Input } from "@/components/ui/input";
import type { TemplateButton } from "@/pages/Channels/whatsapp/types/templates/template.type";
import type { TemplateForm } from "@/pages/Channels/whatsapp/validations/template.schema";
import React from "react";
import { useFormContext } from "react-hook-form";

interface ICopyCodeFieldsProps {
  button: TemplateButton;
}

export function CopyCodeFields({ button }: ICopyCodeFieldsProps) {
  // const { updateButton } = useTemplateStore((state) => state);

  const { setValue, getValues } = useFormContext<TemplateForm>();

  const updateButton = (id: string, data: any) => {
    const buttons = getValues("buttons");
    const newButtons = buttons?.map((button) =>
      button.id === id
        ? {
            ...button,
            ...data,
          }
        : button,
    );
    setValue("buttons", newButtons);
  };

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
