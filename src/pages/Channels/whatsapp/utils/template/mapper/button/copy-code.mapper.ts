import type {
  TMetaTemplateButton,
  TTemplateButton,
} from "@/pages/Channels/whatsapp/types/templates";

export function mapCopyCodeButton(
  button: TTemplateButton,
): TMetaTemplateButton {
  return {
    type: "COPY_CODE",
    text: button.label,
    example: button.offerCode,
  };
}
