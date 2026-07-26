import { Textarea } from "@/components/ui/textarea";
import { generateId } from "@/utils/generateId.utils";
import { Pencil } from "lucide-react";
import { useRef } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { TemplateForm } from "../../../validations/template.schema";
import { VariableAccordion } from "../shared/VariableAccordion";

export const BodyEditor = () => {
  const {
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<TemplateForm>();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Save cursor every time it moves
  // const saveCursor = () => {
  //   const pos = textareaRef.current?.selectionStart;
  //   if (pos !== undefined) setBodyCursorPos(pos);
  // };

  const handleAddBlankVariable = () => {
    const body = getValues("bodyText");
    const vars = getValues("bodyVariables");
    const type = getValues("variableType");

    const cursor = textareaRef.current?.selectionStart ?? body.length;
    const placeholder = type === "Number" ? `{{${vars.length + 1}}}` : "{{}}";
    const newBody = body.slice(0, cursor) + placeholder + body.slice(cursor);

    setValue("bodyText", newBody);
    setValue("bodyVariables", [
      ...vars,
      {
        id: generateId(),
        name: "",
        exampleValue: "",
      },
    ]);
  };

  const handleUpdateVariable = (
    id: string,
    field: "name" | "exampleValue",
    value: string,
  ) => {
    const variables = getValues("bodyVariables");
    const variableType = getValues("variableType");
    let body = getValues("bodyText");

    const index = variables.findIndex((v) => v.id === id);

    if (index === -1) return;

    const oldVariable = variables[index];

    const updated = variables.map((v) =>
      v.id === id ? { ...v, [field]: value } : v,
    );

    if (field === "name" && variableType === "Name") {
      if (oldVariable.name) {
        // rename existing placeholder
        body = body.replace(
          new RegExp(`\\{\\{${oldVariable.name}\\}\\}`, "g"),
          `{{${value}}}`,
        );
      } else {
        // first time user enters a name
        body = body.replace("{{}}", `{{${value}}}`);
      }

      setValue("bodyText", body, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    setValue("bodyVariables", updated, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleRemoveVariable = (id: string) => {
    const variables = getValues("bodyVariables");
    let body = getValues("bodyText");
    const variableType = getValues("variableType");

    const index = variables.findIndex((v) => v.id === id);

    if (index === -1) return;

    // Remove variable from array
    const newVariables = variables.filter((v) => v.id !== id);

    if (variableType === "Number") {
      // Remove the placeholder
      body = body.replace(new RegExp(`\\{\\{${index + 1}\\}\\}`, "g"), "");

      // Re-index remaining placeholders
      for (let i = index + 2; i <= variables.length; i++) {
        body = body.replace(
          new RegExp(`\\{\\{${i}\\}\\}`, "g"),
          `{{${i - 1}}}`,
        );
      }
    } else {
      // Name mode
      const variable = variables[index];
      body = body.replace(new RegExp(`\\{\\{${variable.name}\\}\\}`, "g"), "");
    }

    setValue("bodyText", body, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("bodyVariables", newVariables, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const syncVariablesFromBody = (body: string) => {
    const current = getValues("bodyVariables");

    // Find every {{variable_name}}
    const matches = [...body.matchAll(/\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g)];

    const newVariables = matches.map((match) => {
      const existing = current.find((v) => v.name === match[1]);

      return {
        id: existing?.id ?? generateId(),
        name: match[1],
        exampleValue: existing?.exampleValue ?? "",
      };
    });

    setValue("bodyVariables", newVariables, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const bodyText = useWatch({ control, name: "bodyText" });
  const bodyVariables = useWatch({ control, name: "bodyVariables" });
  // const varialbeType = useWatch({ control, name: "variableType" });

  return (
    <section className="rounded-2xl border border-gray-200 space-y-3 px-5 py-3">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">Body</span>
        <button
          type="button"
          onClick={handleAddBlankVariable}
          className="flex items-center gap-1.5 text-xs text-green-700 font-medium border border-green-300 rounded-2xl px-2.5 h-7 hover:bg-green-50 transition-colors"
        >
          <Pencil size={12} />
          Add Variable
        </button>
      </div>

      {/* Textarea — tracks cursor on every interaction */}
      <div className="relative">
        <Controller
          name="bodyText"
          control={control}
          render={({ field }) => (
            <Textarea
              ref={textareaRef}
              value={field.value}
              onChange={(e) => {
                field.onChange(e.target.value);
                if (getValues("variableType") === "Name") {
                  syncVariablesFromBody(e.target.value);
                }
                // saveCursor();
              }}
              maxLength={1024}
              rows={5}
              placeholder="Enter your message body. Use {{1}}, {{2}} for variables."
              className="input-field resize-none pb-6 text-sm min-h-24"
            />
          )}
        />
        {/* <Textarea
            ref={textareaRef}
            value={bodyText}
            onChange={(e) => {
              setBodyText(e.target.value);
              saveCursor();
            }}
            // onMouseUp={saveCursor}
            maxLength={1024}
            rows={5}
            placeholder="Enter your message body. Use {{1}}, {{2}} for variables."
            className="input-field resize-none pb-6 text-sm min-h-24"
          /> */}
        <span className="absolute bottom-0 right-2 text-xs text-gray-400 pointer-events-none">
          {(bodyText || "").length}/1024
        </span>

        {errors.bodyText && (
          <p className="mt-1 text-xs text-red-500">{errors.bodyText.message}</p>
        )}
      </div>

      <VariableAccordion
        title="Manage Variables"
        variables={bodyVariables}
        onUpdate={handleUpdateVariable}
        onRemove={handleRemoveVariable}
      />
    </section>
  );
};

// import { Pencil } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { VariableAccordion } from "../shared/VariableAccordion";
// import { useTemplateStore } from "../../../store/template-builder.store";

// export const BodyEditor = () => {
//   const {
//     bodyText,
//     setBodyText,

//     bodyVariables,
//     updateBodyVariable,
//     removeBodyVariable,

//     addBodyVariable,
//   } = useTemplateStore();

//   const bodyMaxLen = 1024;

//   return (
//     <section className="rounded-2xl border border-gray-200 p-2 space-y-3">
//       <div className="flex items-center justify-between">
//         <div>
//           <span className="text-sm font-semibold text-gray-800">Body *</span>
//         </div>

//         <Button
//           className="flex bg-transparent! items-center gap-1.5 text-xs text-green-700 font-medium border border-green-300 h-7! hover:bg-green-50 transition-colors rounded-2xl"
//           onClick={addBodyVariable}
//         >
//           <Pencil size={12} />

//           <span>Add Variable</span>
//         </Button>
//       </div>

//       <div className="relative">
//         <Textarea
//           value={bodyText}
//           maxLength={bodyMaxLen}
//           className="input-field resize-none pr-16 min-h-24"
//           placeholder={`Body text (max ${bodyMaxLen} characters)`}
//           onChange={(e) => setBodyText(e.target.value)}
//         />

//         <span className="absolute bottom-1 right-2 text-xs text-muted-foreground">
//           {bodyText.length}/{bodyMaxLen}
//         </span>
//       </div>

//       <div>
//         {/* <p className="text-xs text-yellow-600">
//           Note: Two consecutive newlines not allowed.
//         </p> */}
//         <p className=" text-xs text-muted-foreground">
//           Add variables to personalize messages such as customer name, order id,
//           tracking number, etc.
//         </p>

//         <VariableAccordion
//           title="Manage Variables"
//           variables={bodyVariables}
//           onUpdate={updateBodyVariable}
//           onRemove={removeBodyVariable}
//         />
//       </div>
//     </section>
//   );
// };
