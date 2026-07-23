import type { TemplateButton } from "@/pages/Channels/whatsapp/types/template.type";

export function mapWhatsAppButton(button: TemplateButton) {
  return {
    type: "VOICE_CALL",
    text: button.label,
    phone_number: `${button.country}${button.phoneNumber}`,
    voice_call: button.activeFor,
  };
}
