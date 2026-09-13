import type {
  TMetaTemplateButton,
  TTemplateButton,
} from "@/pages/Channels/whatsapp/types/templates";

export function mapPhoneButton(button: TTemplateButton): TMetaTemplateButton {
  return {
    type: "PHONE_NUMBER",
    text: button.label,
    phone_number: `${button.countryCode || "+91"}${button.phoneNumber}`,
  };
}
