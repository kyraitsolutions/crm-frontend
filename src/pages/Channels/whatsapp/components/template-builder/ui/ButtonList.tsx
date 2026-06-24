import { useTemplateStore } from "../../../store/template-builder.store";
import { ButtonRow } from "./ButtonRow";

export const ButtonsList = () => {
  const { buttons, updateButton, removeButton } = useTemplateStore();

  if (!buttons.length) {
    return null;
  }

  return (
    <div>
      {buttons.map((button) => (
        <ButtonRow
          key={button.id}
          id={button.id}
          type={button.type}
          label={button.label}
          value={button.value}
          onUpdate={(id, field, value) => updateButton(id, field, value)}
          onRemove={removeButton}
        />
      ))}
    </div>
  );
};
