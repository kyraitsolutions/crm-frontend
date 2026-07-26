import type { TemplateButton } from "@/pages/Channels/whatsapp/types/templates/template.type";

export function mapCopyCodeButton(button: TemplateButton) {
  return {
    type: "COPY_CODE",
    text: button.label,
    example: button.offerCode,
  };
}
