import type { TemplateButton } from "@/pages/Channels/whatsapp/types/template.type";

export function mapPhoneButton(button: TemplateButton) {
  return {
    type: "PHONE_NUMBER",
    text: button.label,
    phone_number: `${button.country}${button.phoneNumber}`,
  };
}
