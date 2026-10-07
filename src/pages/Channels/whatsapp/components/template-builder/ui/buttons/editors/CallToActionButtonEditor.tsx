import type { TTemplateButton } from "@/pages/Channels/whatsapp/types/templates";
import { ButtonCard } from "../ButtonCard";
import { useTemplateButtons } from "../buttons-field.context";
import { ButtonTextField } from "../fields/ButtonTextField";
import { CopyCodeFields } from "../fields/CopyCodeFields";
import { PhoneFields } from "../fields/PhoneFields";
import { TypeOfActionField } from "../fields/TypeOfActionField";
import { UrlFields } from "../fields/UrlFields";
import { WhatsAppFields } from "../fields/WhatsAppFields";

interface ICallToActionProps {
  button: TTemplateButton;
}

export function CallToActionButtonEditor({ button }: ICallToActionProps) {
  const { removeButton } = useTemplateButtons();

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
      default:
        return null;
    }
  };

  return (
    <ButtonCard onDelete={() => removeButton(button.id)}>
      <div className="space-y-5">
        <div className="grid grid-cols-12 gap-3">
          <TypeOfActionField button={button} />
          <ButtonTextField button={button} />
          {renderFields()}
        </div>
      </div>
    </ButtonCard>
  );
}
