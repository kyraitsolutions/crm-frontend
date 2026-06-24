import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { VariableRow } from "./VariableRow";

interface Variable {
  id: string;
  name: string;
  exampleValue: string;
}

interface VariableAccordionProps {
  title?: string;
  variables: Variable[];

  onUpdate: (id: string, field: "name" | "exampleValue", value: string) => void;

  onRemove: (id: string) => void;
}

export const VariableAccordion = ({
  title = "Manage Variables",
  variables,
  onUpdate,
  onRemove,
}: VariableAccordionProps) => {
  if (!variables.length) {
    return null;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="variables">
        <AccordionTrigger className="py-2 text-sm font-medium text-green-700">
          {title} ({variables.length})
        </AccordionTrigger>

        <AccordionContent>
          <div className="rounded-lg border border-gray-200">
            {/* Header */}
            <div className="grid grid-cols-[32px_1fr_1fr_45px] items-center gap-2 border-b border-gray-200 bg-muted/40 px-2 py-2 text-xs font-medium text-muted-foreground">
              <span className="text-center">#</span>
              <span>Variable Name</span>
              <span>Example Value</span>
              <span>Actions</span>
            </div>

            {/* Rows */}
            <div className="px-2">
              {variables.map((variable, index) => (
                <VariableRow
                  key={variable.id}
                  index={index + 1}
                  id={variable.id}
                  name={variable.name}
                  exampleValue={variable.exampleValue}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
