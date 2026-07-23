import { useTemplateStore } from "@/pages/Channels/whatsapp/store/template-builder.store";
import type { TemplateButton } from "@/pages/Channels/whatsapp/types/template.type";
import { ButtonCard } from "../ButtonCard";
import { TypeOfActionField } from "../fields/TypeOfActionField";
import { UrlFields } from "../fields/UrlFields";
import { ButtonTextField } from "../fields/ButtonTextField";
import { PhoneFields } from "../fields/PhoneFields";
import { WhatsAppFields } from "../fields/WhatsAppFields";
import { CopyCodeFields } from "../fields/CopyCodeFields";

interface ICallToActionProps {
  button: TemplateButton;
}

export function CallToActionButtonEditor({ button }: ICallToActionProps) {
  const { removeButton } = useTemplateStore((state) => state);

  const renderFields = () => {
    switch (button.kind) {
      case "URL":
        return <UrlFields button={button} />;

      case "PHONE_NUMBER":
        return <PhoneFields button={button} />;

      case "CALL_ON_WHATSAPP":
        return <WhatsAppFields button={button} />;

      case "COPY_CODE":
        return <CopyCodeFields button={button} />;

      // case "SHARE_CONTACT":
      //   return <ShareContactFields button={button} />;

      default:
        return null;
    }
  };

  //   const renderBottom = () => {
  //     switch (button.kind) {
  //       case "URL":
  //         return <TrackConversionField button={button} />;

  //       case "CALL_ON_WHATSAPP":
  //         return <WhatsappInfo />;

  //       default:
  //         return null;
  //     }
  //   };

  return (
    <ButtonCard onDelete={() => removeButton(button.id)}>
      <div className="space-y-5">
        <div className="grid grid-cols-12 gap-3">
          {/* Common Fields */}
          <TypeOfActionField button={button} />
          <ButtonTextField button={button} />

          {/* Dynamic Fields */}
          {renderFields()}
        </div>

        {/* Extra Section */}
        {/* {renderBottom()} */}
      </div>
    </ButtonCard>
  );
}
