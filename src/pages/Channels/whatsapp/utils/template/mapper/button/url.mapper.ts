import type { TemplateButton } from "@/pages/Channels/whatsapp/types/template.type";

export function mapUrlButton(button: TemplateButton) {
  return {
    type: "URL",
    text: button.label,
    url: button.url,
  };
}
