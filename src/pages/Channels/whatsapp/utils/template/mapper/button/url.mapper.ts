import type {
  TMetaTemplateButton,
  TTemplateButton,
} from "@/pages/Channels/whatsapp/types/templates";

export function mapUrlButton(button: TTemplateButton): TMetaTemplateButton {
  return {
    type: "URL",
    text: button.label,
    url: button.url,
  };
}
