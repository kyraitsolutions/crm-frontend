import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { VariableAccordion } from "../shared/VariableAccordion";
import { useTemplateStore } from "../../../store/template-builder.store";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";

const HEADER_TYPES = ["Text", "Image", "Video", "Document"] as const;

export const HeaderEditor = () => {
  const {
    headerType,
    setHeaderType,

    headerText,
    setHeaderText,

    headerVariables,
    updateHeaderVariable,
    removeHeaderVariable,

    addHeaderVariable,
  } = useTemplateStore();

  const headerMaxLen = 60;

  const canAddVariable = headerType === "Text" && headerVariables.length === 0;

  return (
    <section className="rounded-xl border border-gray-200 space-y-3 p-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-gray-800">Header</span>

          <span className="ml-2 text-xs text-gray-400">(Optional)</span>
        </div>

        {canAddVariable && (
          <Button
            className="flex bg-transparent! items-center gap-1.5 text-xs text-green-700 font-medium border border-green-300 h-7! hover:bg-green-50 transition-colors rounded-xl"
            onClick={addHeaderVariable}
          >
            <Pencil size={12} />

            <span>Add Variable</span>
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <div>
          <Select
            value={headerType}
            onValueChange={(value) =>
              setHeaderType(value as "Text" | "Image" | "Video" | "Document")
            }
          >
            <SelectTrigger className="input-field">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {HEADER_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {headerType === "Text" && (
          <div className="relative flex-1">
            <Input
              value={headerText}
              maxLength={headerMaxLen}
              className="input-field resize-none"
              placeholder="Header text..."
              onChange={(e) => setHeaderText(e.target.value)}
            />

            <span className="absolute bottom-1 right-2 text-xs text-gray-400">
              {headerText.length}/{headerMaxLen}
            </span>
          </div>
        )}
      </div>

      {headerType === "Text" && (
        <p className="mb-2 flex items-center gap-1 text-xs text-blue-500">
          <span>ℹ️</span>
          Text headers support 1 variable only.
        </p>
      )}

      <VariableAccordion
        title="Manage Variables"
        variables={headerVariables}
        onUpdate={updateHeaderVariable}
        onRemove={removeHeaderVariable}
      />
    </section>
  );
};
