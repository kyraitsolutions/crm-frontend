import type {
  TMetaTemplateButton,
  TTemplateButton,
  TTemplateComponent,
} from "../../../types/templates";
import { mapCopyCodeButton } from "./button/copy-code.mapper";
import { mapPhoneButton } from "./button/phone.mapper";
import { mapQuickReplyButton } from "./button/quick-reply.mapper";
// import { mapShareContactButton } from "./button/share-contact.mapper";
import { mapUrlButton } from "./button/url.mapper";
import { mapWhatsAppButton } from "./button/whatsapp.mapper";

export function mapButtons(
  buttons: TTemplateButton[],
): Extract<TTemplateComponent, { type: "BUTTONS" }> | null {
  if (!buttons.length) {
    return null;
  }

  const mappedButtons = buttons
    .map((button): TMetaTemplateButton | null => {
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

        // case "SHARE_CONTACT":
        //   return mapShareContactButton(button);

        default:
          return null;
      }
    })
    .filter((button): button is TMetaTemplateButton => button !== null);

  return {
    type: "BUTTONS",
    buttons: mappedButtons,
    variableMappings: [],
  };
}

// export function mapButtons(
//   buttons: TTemplateButton[],
// ): TTemplateComponent | null {

//   if (!buttons.length) {
//     return null;
//   }

//   return {
//     type: "BUTTONS",
//     buttons: buttons
//       .map((button) : TMetaTemplateButton | null => {
//         switch (button.kind) {
//           case "QUICK_REPLY":
//             return mapQuickReplyButton(button);

//           case "URL":
//             return mapUrlButton(button);

//           case "PHONE_NUMBER":
//             return mapPhoneButton(button);

//           case "CALL_ON_WHATSAPP":
//             return mapWhatsAppButton(button);

//           case "COPY_CODE":
//             return mapCopyCodeButton(button);

//           case "SHARE_CONTACT":
//             return mapShareContactButton(button);

//           default:
//             return null;
//         }
//       })
//       .filter(Boolean),
//   };
// }
