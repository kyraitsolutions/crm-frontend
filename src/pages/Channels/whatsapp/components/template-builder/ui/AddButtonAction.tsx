import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTemplateStore } from "../../../store/template-builder.store";

export const AddButtonAction = () => {
  const { buttonStrategy, buttons, addButton } = useTemplateStore();

  if (buttonStrategy === "No Buttons" || buttons.length >= 10) {
    return null;
  }

  return (
    <Button className="actions-btn text-xs!" onClick={addButton}>
      <Plus size={14} />
      Add Button
    </Button>
  );
};
