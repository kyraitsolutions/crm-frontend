import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import { ButtonMenuItem } from "./ButtonMenuItem";
import { useTemplateButtons } from "./buttons-field.context";

export const AddButtonAction = () => {
  const { buttons, maxButtons } = useTemplateButtons();
  const totalReached = buttons.length >= maxButtons;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          disabled={totalReached}
          className="gap-2 actions-btn px-3! py-1.5! rounded-xl!"
        >
          <Plus className="h-4 w-4" />
          Add button
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-80 p-0 rounded-xl!">
        <div className="border-b px-4 py-3">
          <p className="font-medium">Add button</p>
          <p className="text-xs text-muted-foreground">
            Maximum {maxButtons} buttons
          </p>
        </div>

        <ButtonMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
