import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { Pencil, Trash2 } from "lucide-react";

interface Variable {
  id: string;
  name: string;
  example: string;
}

interface VariableTableProps {
  title?: string;
  variables: Variable[];
  onDelete?: (id: string) => void;
}

export const VariableTable = ({
  title = "Manage Variables",
  variables,
  onDelete,
}: VariableTableProps) => {
  if (!variables.length) {
    return null;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="variables">
        <AccordionTrigger>
          {title} ({variables.length})
        </AccordionTrigger>

        <AccordionContent>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-2 text-left text-xs">Variable Name</th>

                  <th className="px-3 py-2 text-left text-xs">Example Value</th>

                  <th className="px-3 py-2 text-right text-xs">Actions</th>
                </tr>
              </thead>

              <tbody>
                {variables.map((variable) => (
                  <tr key={variable.id} className="border-b">
                    <td className="px-3 py-2 text-sm">{variable.name}</td>

                    <td className="px-3 py-2 text-sm">{variable.example}</td>

                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost">
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDelete?.(variable.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
