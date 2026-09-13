import type {
  TMetaTemplateButton,
  TTemplateButton,
} from "@/pages/Channels/whatsapp/types/templates";

export function mapWhatsAppButton(
  button: TTemplateButton,
): TMetaTemplateButton {
  return {
    type: "CALL_ON_WHATSAPP",
    text: button.label,
    phone_number: `${button.country}${button.phoneNumber}`,
    voice_call: button.activeFor,
  };
}
