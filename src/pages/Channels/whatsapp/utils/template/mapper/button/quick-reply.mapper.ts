import type { TemplateButton } from "@/pages/Channels/whatsapp/types/template.type";

export function mapQuickReplyButton(button: TemplateButton) {
  return {
    type: "QUICK_REPLY",
    text: button.label,
  };
}
