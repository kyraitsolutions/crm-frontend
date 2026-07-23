import type { TemplateButton } from "@/pages/Channels/whatsapp/types/template.type";

export function mapShareContactButton(button: TemplateButton) {
  return {
    type: "MPM",
    text: button.label,
  };
}
