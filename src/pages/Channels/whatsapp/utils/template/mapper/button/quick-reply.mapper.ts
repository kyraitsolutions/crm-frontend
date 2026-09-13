import type {
  TMetaTemplateButton,
  TTemplateButton,
} from "@/pages/Channels/whatsapp/types/templates";

export function mapQuickReplyButton(
  button: TTemplateButton,
): TMetaTemplateButton {
  return {
    type: "QUICK_REPLY",
    text: button.label,
  };
}
