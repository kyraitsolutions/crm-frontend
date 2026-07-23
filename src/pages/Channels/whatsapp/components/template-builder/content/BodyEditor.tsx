import { useRef } from "react";
import { Pencil } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  useTemplateStore,
  setBodyCursorPos,
} from "../../../store/template-builder.store";
import { VariableAccordion } from "../shared/VariableAccordion";

export const BodyEditor = () => {
  const {
    bodyText,
    setBodyText,
    bodyVariables,
    // addBodyVariable,sss
    updateBodyVariable,
    removeBodyVariable,
    insertVariableToBody,
  } = useTemplateStore();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Save cursor every time it moves
  const saveCursor = () => {
    const pos = textareaRef.current?.selectionStart;
    if (pos !== undefined) setBodyCursorPos(pos);
  };

  const handleAddBlankVariable = () => {
    const cursorPos = textareaRef.current?.selectionStart;
    // const nextIdx = bodyVariables.length + 1;
    // const placeholder = `{{${nextIdx}}}`;

    insertVariableToBody("", cursorPos);
    // restoreCursor(placeholder.length, cursorPos ?? bodyText.length);
  };

  return (
    <section className="rounded-xl border border-gray-200 space-y-3 p-4">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">Body</span>
        <button
          onClick={handleAddBlankVariable}
          className="flex items-center gap-1.5 text-xs text-green-700 font-medium border border-green-300 rounded-xl px-2.5 h-7 hover:bg-green-50 transition-colors"
        >
          <Pencil size={12} />
          Add Variable
        </button>
      </div>

      {/* Textarea — tracks cursor on every interaction */}
      <div className="relative">
        <Textarea
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
        />
        <span className="absolute bottom-2 right-2 text-xs text-gray-400 pointer-events-none">
          {bodyText.length}/1024
        </span>
      </div>

      <VariableAccordion
        title="Manage Variables"
        variables={bodyVariables}
        onUpdate={updateBodyVariable}
        onRemove={removeBodyVariable}
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
//     <section className="rounded-xl border border-gray-200 p-2 space-y-3">
//       <div className="flex items-center justify-between">
//         <div>
//           <span className="text-sm font-semibold text-gray-800">Body *</span>
//         </div>

//         <Button
//           className="flex bg-transparent! items-center gap-1.5 text-xs text-green-700 font-medium border border-green-300 h-7! hover:bg-green-50 transition-colors rounded-xl"
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
