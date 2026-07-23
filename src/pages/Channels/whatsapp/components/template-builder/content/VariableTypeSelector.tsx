import { CircleHelp } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTemplateStore } from "../../../store/template-builder.store";
import { VARIABLE_TYPES } from "../../../constants/template.constants";

export function VariableTypeSelector() {
  const { variableType, setVariableType } = useTemplateStore((state) => state);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Content</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Add a header, body and footer for your template. Meta reviews template
          variables and content before approval.
        </p>
      </div>

      <div className="max-w-sm space-y-1.5">
        <label className="flex items-center gap-1 text-sm font-medium">
          Type of variable
          <CircleHelp className="h-4 w-4 text-muted-foreground" />
        </label>

        <Select
          value={variableType}
          onValueChange={(value) => setVariableType(value as any)}
        >
          <SelectTrigger className="input-field">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {VARIABLE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* <p className="text-xs text-muted-foreground">
          {VARIABLE_TYPES.find((v) => v.value === variableType)?.description}
        </p> */}
      </div>
    </div>
  );
}
