import { groupButtons } from "@/pages/Channels/whatsapp/utils/template/template.utils";
import { useTemplateStore } from "../../../../store/template-builder.store";
import { ButtonRow } from "./ButtonRow";
import type { TemplateButton } from "@/pages/Channels/whatsapp/types/template.type";

export const ButtonsList = () => {
  const { buttons } = useTemplateStore();
  const { callToAction, quickReply } = groupButtons(buttons);

  return (
    <div className="space-y-6">
      {callToAction.length > 0 && (
        <ButtonSection title="Call to action" buttons={callToAction} />
      )}

      {quickReply.length > 0 && (
        <ButtonSection title="Quick reply" buttons={quickReply} />
      )}
    </div>
  );
};

interface IButtonSectionProps {
  title: string;
  buttons: TemplateButton[];
}

export function ButtonSection({ title, buttons }: IButtonSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>

        <span className="text-muted-foreground text-xs">Optional</span>
      </div>

      <div className="space-y-3">
        {buttons.map((button) => (
          <ButtonRow key={button.id} button={button} />
        ))}
      </div>
    </section>
  );
}

// import { useTemplateStore } from "../../../../store/template-builder.store";
// import { ButtonRow } from "./ButtonRow";

// export const ButtonsList = () => {
//   const { buttons } = useTemplateStore((state) => state);

//   if (!buttons.length) {
//     return null;
//   }

//   return (
//     <div className="space-y-4">
//       {buttons.map((button) => (
//         <ButtonRow
//           key={button.id}
//           button={button}
//           // type={button.type}
//           // label={button.label}
//           // value={button.value}
//           // onUpdate={(id, field, value) => updateButton(id, field, value)}
//           // onRemove={removeButton}
//         />
//       ))}
//     </div>
//   );
// };
