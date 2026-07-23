import { mapQuickReplyButton } from "./button/quick-reply.mapper";
import { mapUrlButton } from "./button/url.mapper";
import { mapPhoneButton } from "./button/phone.mapper";
import { mapWhatsAppButton } from "./button/whatsapp.mapper";
import { mapCopyCodeButton } from "./button/copy-code.mapper";
import { mapShareContactButton } from "./button/share-contact.mapper";
import type {
  TemplateButton,
  TemplateComponent,
} from "../../../types/template.type";

export function mapButtons(
  buttons: TemplateButton[],
): TemplateComponent | null {
  if (!buttons.length) {
    return null;
  }

  return {
    type: "BUTTONS",
    buttons: buttons
      .map((button) => {
        switch (button.kind) {
          case "QUICK_REPLY":
            return mapQuickReplyButton(button);

          case "URL":
            return mapUrlButton(button);

          case "PHONE_NUMBER":
            return mapPhoneButton(button);

          case "CALL_ON_WHATSAPP":
            return mapWhatsAppButton(button);

          case "COPY_CODE":
            return mapCopyCodeButton(button);

          case "SHARE_CONTACT":
            return mapShareContactButton(button);

          default:
            return null;
        }
      })
      .filter(Boolean),
  };
}
