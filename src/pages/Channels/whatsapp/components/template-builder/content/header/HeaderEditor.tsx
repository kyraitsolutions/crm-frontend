import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import type { TemplateForm } from "@/pages/Channels/whatsapp/validations/template.schema";
import { Pencil } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { HeaderMediaUploader } from "./HeaderMediaUploader";
import { generateId } from "@/utils/generateId.utils";
import { VariableAccordion } from "../../shared/VariableAccordion";

const HEADER_TYPES = ["Text", "Image", "Video", "Document"] as const;

export const HeaderEditor = () => {
  const { control, setValue } = useFormContext<TemplateForm>();

  const headerType = useWatch({
    control,
    name: "headerType",
  });

  const headerText = useWatch({
    control,
    name: "headerText",
  });

  const headerVariables = useWatch({
    control,
    name: "headerVariables",
  });

  const variableType = useWatch({
    control,
    name: "variableType",
  });

  const headerMaxLen = 60;

  const canAddVariable = headerType === "Text" && headerVariables.length === 0;

  const addHeaderVariable = () => {
    if (headerVariables.length >= 1) return;

    const placeholder = variableType === "Number" ? "{{1}}" : "{{}}";

    const newHeaderText = headerText + placeholder;

    setValue("headerText", newHeaderText, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue(
      "headerVariables",
      [
        {
          id: generateId(),
          name: "",
          exampleValue: "",
        },
      ],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const updateHeaderVariable = (
    id: string,
    field: "name" | "exampleValue",
    value: string,
  ) => {
    const index = headerVariables.findIndex((variable) => variable.id === id);

    if (index === -1) return;

    const oldVariable = headerVariables[index];

    const updatedVariables = headerVariables.map((variable) =>
      variable.id === id
        ? {
            ...variable,
            [field]: value,
          }
        : variable,
    );

    // NAME variable
    if (field === "name" && variableType === "Name") {
      let newHeaderText = headerText;

      if (oldVariable.name) {
        newHeaderText = newHeaderText.replace(
          new RegExp(`\\{\\{${oldVariable.name}\\}\\}`, "g"),
          `{{${value}}}`,
        );
      } else {
        newHeaderText = newHeaderText.replace("{{}}", `{{${value}}}`);
      }

      setValue("headerText", newHeaderText, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    setValue("headerVariables", updatedVariables, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const removeHeaderVariable = (id: string) => {
    const variable = headerVariables.find((variable) => variable.id === id);

    if (!variable) return;

    let newHeaderText = headerText;

    if (variableType === "Number") {
      newHeaderText = newHeaderText.replace(/\{\{1\}\}/g, "");
    } else {
      if (variable.name) {
        newHeaderText = newHeaderText.replace(
          new RegExp(`\\{\\{${variable.name}\\}\\}`, "g"),
          "",
        );
      } else {
        newHeaderText = newHeaderText.replace("{{}}", "");
      }
    }

    setValue("headerText", newHeaderText, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("headerVariables", [], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const syncVariablesFromHeader = (text: string) => {
    if (variableType === "Number") {
      const matches = [...text.matchAll(/\{\{(\d+)\}\}/g)];

      const newVariables = matches.slice(0, 1).map((match) => {
        const existing = headerVariables[0];

        return {
          id: existing?.id ?? generateId(),
          name: match[1],
          exampleValue: existing?.exampleValue ?? "",
          component: "HEADER" as const,
        };
      });

      setValue("headerVariables", newVariables, {
        shouldDirty: true,
        shouldValidate: true,
      });

      return;
    }

    const matches = [...text.matchAll(/\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g)];

    const newVariables = matches.slice(0, 1).map((match) => {
      const existing = headerVariables.find(
        (variable) => variable.name === match[1],
      );

      return {
        id: existing?.id ?? generateId(),
        name: match[1],
        exampleValue: existing?.exampleValue ?? "",
        component: "HEADER" as const,
      };
    });

    setValue("headerVariables", newVariables, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <section className="rounded-2xl border border-gray-200 space-y-3 px-5 py-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-gray-800">Header</span>

          <span className="ml-2 text-xs text-gray-400">(Optional)</span>
        </div>

        {canAddVariable && (
          <Button
            className="flex bg-transparent! items-center gap-1.5 text-xs text-green-700 font-medium border border-green-300 h-7! hover:bg-green-50 transition-colors rounded-2xl"
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
              setValue("headerType", value, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="input-field">
              <SelectValue />
            </SelectTrigger>

            <SelectContent className="rounded">
              {HEADER_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          {headerType === "Text" ? (
            <div className="relative">
              <Input
                value={headerText}
                maxLength={headerMaxLen}
                className="input-field"
                placeholder="Header text..."
                onChange={(e) => {
                  const value = e.target.value;

                  setValue("headerText", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });

                  syncVariablesFromHeader(value);
                }}
              />

              <span className="absolute bottom-1 right-2 text-xs text-gray-400">
                {headerText.length}/{headerMaxLen}
              </span>
            </div>
          ) : (
            <HeaderMediaUploader />
          )}
        </div>
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

// export const HeaderEditor = () => {
//   const { control, setValue } = useFormContext<TemplateForm>();

//   const headerType = useWatch({
//     control,
//     name: "headerType",
//   });

//   const headerText = useWatch({
//     control,
//     name: "headerText",
//   });

//   const headerVariables = useWatch({
//     control,
//     name: "headerVariables",
//   });

//   const headerMaxLen = 60;

//   const canAddVariable = headerType === "Text" && headerVariables.length === 0;

//   const addHeaderVariable = () => {
//     setValue("headerVariables", [
//       ...headerVariables,
//       {
//         id: generateId(),
//         name: "",
//         exampleValue: "",
//         // component: "HEADER" as const,
//       },
//     ]);
//   };

//   const updateHeaderVariable = (id: string, field: string, value: string) => {
//     setValue(
//       "headerVariables",
//       headerVariables.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
//     );
//   };

//   const removeHeaderVariable = (id: string) => {
//     setValue(
//       "headerVariables",
//       headerVariables.filter((v) => v.id !== id),
//     );
//   };

//   return (
//     <section className="rounded-2xl border border-gray-200 space-y-3 px-5 py-3">
//       <div className="flex items-center justify-between">
//         <div>
//           <span className="text-sm font-semibold text-gray-800">Header</span>
//           <span className="ml-2 text-xs text-gray-400">(Optional)</span>
//         </div>

//         {canAddVariable && (
//           <Button
//             className="flex bg-transparent! items-center gap-1.5 text-xs text-green-700 font-medium border border-green-300 h-7! hover:bg-green-50 transition-colors rounded-xl"
//             onClick={addHeaderVariable}
//           >
//             <Pencil size={12} />

//             <span>Add Variable</span>
//           </Button>
//         )}
//       </div>

//       <div className="flex gap-2">
//         <div>
//           <Select
//             value={headerType}
//             onValueChange={(value) =>
//               setValue("headerType", value, { shouldValidate: true })
//             }
//           >
//             <SelectTrigger className="input-field">
//               <SelectValue />
//             </SelectTrigger>

//             <SelectContent className="rounded">
//               {HEADER_TYPES.map((type) => (
//                 <SelectItem key={type} value={type}>
//                   {type}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="flex-1">
//           {headerType === "Text" ? (
//             <div className="relative">
//               <Input
//                 value={headerText}
//                 maxLength={headerMaxLen}
//                 className="input-field"
//                 placeholder="Header text..."
//                 onChange={(e) =>
//                   setValue("headerText", e.target.value, {
//                     shouldValidate: true,
//                   })
//                 }
//               />

//               <span className="absolute bottom-1 right-2 text-xs text-gray-400">
//                 {headerText.length}/{headerMaxLen}
//               </span>
//             </div>
//           ) : (
//             <HeaderMediaUploader />
//           )}
//         </div>

//         {/* {headerType === "Text" && (
//           <div className="relative flex-1">
//             <Input
//               value={headerText}
//               maxLength={headerMaxLen}
//               className="input-field resize-none"
//               placeholder="Header text..."
//               onChange={(e) => setHeaderText(e.target.value)}
//             />

//             <span className="absolute bottom-1 right-2 text-xs text-gray-400">
//               {headerText.length}/{headerMaxLen}
//             </span>
//           </div>
//         )} */}
//       </div>

//       {headerType === "Text" && (
//         <p className="mb-2 flex items-center gap-1 text-xs text-blue-500">
//           <span>ℹ️</span>
//           Text headers support 1 variable only.
//         </p>
//       )}

//       <VariableAccordion
//         title="Manage Variables"
//         variables={headerVariables}
//         onUpdate={updateHeaderVariable}
//         onRemove={removeHeaderVariable}
//       />
//     </section>
//   );
// };
