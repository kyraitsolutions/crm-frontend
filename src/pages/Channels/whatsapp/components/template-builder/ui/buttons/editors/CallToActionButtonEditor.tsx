import type { TemplateButton } from "@/pages/Channels/whatsapp/types/templates/template.type";
import type { TemplateForm } from "@/pages/Channels/whatsapp/validations/template.schema";
import { useFormContext } from "react-hook-form";
import { ButtonCard } from "../ButtonCard";
import { ButtonTextField } from "../fields/ButtonTextField";
import { CopyCodeFields } from "../fields/CopyCodeFields";
import { PhoneFields } from "../fields/PhoneFields";
import { TypeOfActionField } from "../fields/TypeOfActionField";
import { UrlFields } from "../fields/UrlFields";
import { WhatsAppFields } from "../fields/WhatsAppFields";

interface ICallToActionProps {
  button: TemplateButton;
}

export function CallToActionButtonEditor({ button }: ICallToActionProps) {
  const { getValues, setValue } = useFormContext<TemplateForm>();
  const removeButton = (id: string) => {
    const buttons = getValues("buttons");
    const newButtons = buttons?.filter((button) => button.id !== id);

    setValue("buttons", newButtons);
  };

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
