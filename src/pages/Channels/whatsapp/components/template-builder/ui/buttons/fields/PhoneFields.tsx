import { CountryCodeSelect } from "@/components/common/CountryCodeSelect";
import { Input } from "@/components/ui/input";
import { useTemplateStore } from "@/pages/Channels/whatsapp/store/template-builder.store";
import type { TemplateButton } from "@/pages/Channels/whatsapp/types/template.type";

interface IPhoneFieldsProps {
  button: TemplateButton;
}

export function PhoneFields({ button }: IPhoneFieldsProps) {
  const { updateButton } = useTemplateStore((state) => state);
  console.log(button);

  return (
    <>
      {/* Country Code */}
      <div className="col-span-2 space-y-1.5">
        <label className="text-sm font-medium">Country Code</label>

        <CountryCodeSelect
          value={button.country ?? "IN"}
          onChange={(value) => {
            console.log(value);
            updateButton(button.id, {
              country: value,
            });
          }}
        />

        {button.errors?.countryCode && (
          <p className="text-xs text-destructive">
            {button.errors.countryCode}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div className="col-span-3 space-y-1.5">
        <label className="text-sm font-medium">Phone Number</label>

        <div className="relative">
          <Input
            className="input-field pr-14"
            placeholder="91XXXXXXXXX"
            maxLength={20}
            value={button.phoneNumber}
            onChange={(e) =>
              updateButton(button.id, {
                phoneNumber: e.target.value,
              })
            }
          />

          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {button?.phoneNumber?.length}/20
          </span>
        </div>

        {button.errors?.phoneNumber && (
          <p className="text-xs text-destructive">
            {button.errors.phoneNumber}
          </p>
        )}
      </div>
    </>
  );
}
