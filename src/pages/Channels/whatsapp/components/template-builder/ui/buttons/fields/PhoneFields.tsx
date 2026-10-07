import { CountryCodeSelect } from "@/components/common/CountryCodeSelect";
import { Input } from "@/components/ui/input";
import type { TTemplateButton } from "@/pages/Channels/whatsapp/types/templates";
import type { CountryCode } from "libphonenumber-js/core";
import { getCountryCallingCode } from "react-phone-number-input";
import { useTemplateButtons } from "../buttons-field.context";

interface IPhoneFieldsProps {
  button: TTemplateButton;
}

export function PhoneFields({ button }: IPhoneFieldsProps) {
  const { updateButton } = useTemplateButtons();

  return (
    <>
      <div className="col-span-2 space-y-1.5">
        <label className="text-sm font-medium">Country Code</label>

        <CountryCodeSelect
          value={button.country ?? "IN"}
          onChange={(value) => {
            updateButton(button.id, {
              country: value,
              countryCode: `+${getCountryCallingCode(value as CountryCode)}`,
            });
          }}
        />

        {button.errors?.countryCode && (
          <p className="text-xs text-destructive">
            {button.errors.countryCode}
          </p>
        )}
      </div>

      <div className="col-span-3 space-y-1.5">
        <label className="text-sm font-medium">Phone Number</label>

        <div className="relative">
          <Input
            className="input-field rounded-xl! pr-14"
            placeholder="91XXXXXXXXX"
            maxLength={20}
            value={button.phoneNumber || ""}
            onChange={(e) =>
              updateButton(button.id, {
                phoneNumber: e.target.value,
              })
            }
          />

          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {(button.phoneNumber || "").length}/20
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
