import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTemplateStore } from "../../../../store/template-builder.store";
import { MAX_TEMPLATE_BUTTONS } from "../../../../constants/template.constants";
import { ButtonMenuItem } from "./ButtonMenuItem";

export const AddButtonAction = () => {
  const { buttons } = useTemplateStore();
  const totalReached = buttons.length >= MAX_TEMPLATE_BUTTONS;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={totalReached}
          className="gap-2 actions-btn px-3! py-2!"
        >
          <Plus className="h-4 w-4" />
          Add button
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-80 p-0">
        <div className="border-b px-4 py-3">
          <p className="font-medium">Add button</p>
          <p className="text-xs text-muted-foreground">
            Maximum {MAX_TEMPLATE_BUTTONS} buttons
          </p>
        </div>

        <ButtonMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// import { useState } from "react";
// import { ChevronDown, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useTemplateStore } from "../../../store/template-builder.store";
// import type { ButtonKind } from "../../../types/template.type";
// import { BUTTON_TYPE_CONFIG } from "../../../constants/template.constants";

// export const AddButtonAction = () => {
//   const { buttons, addButton } = useTemplateStore();
//   const [open, setOpen] = useState(false);

//   const hasStandalone = buttons.some(
//     (b) => BUTTON_TYPE_CONFIG[b.kind]?.standaloneOnly,
//   );
//   const atTotalLimit = buttons.length >= 10;

//   const countByKind = buttons.reduce<Record<string, number>>((acc, b) => {
//     acc[b.kind] = (acc[b.kind] ?? 0) + 1;
//     return acc;
//   }, {});

//   return (
//     <div className="relative inline-block">
//       <Button
//         type="button"
//         className="actions-btn text-xs! flex items-center gap-1.5"
//         onClick={() => setOpen((v) => !v)}
//         disabled={atTotalLimit || hasStandalone}
//       >
//         <Plus size={14} />
//         Add button
//         <ChevronDown size={12} />
//       </Button>

//       {open && (
//         <div className="absolute z-10 mt-1 w-64 rounded-xl border border-gray-200 bg-white shadow-lg py-1">
//           {(Object.keys(BUTTON_TYPE_CONFIG) as ButtonKind[]).map((kind) => {
//             const config = BUTTON_TYPE_CONFIG[kind];
//             const used = countByKind[kind] ?? 0;
//             const disabled =
//               used >= config.maxCount ||
//               (buttons.length > 0 && config.standaloneOnly) ||
//               (hasStandalone && !config.standaloneOnly);

//             return (
//               <button
//                 key={kind}
//                 type="button"
//                 disabled={disabled}
//                 onClick={() => {
//                   addButton(kind);
//                   setOpen(false);
//                 }}
//                 className={`w-full text-left px-3 py-2 text-sm flex flex-col gap-0.5 transition-colors ${
//                   disabled
//                     ? "opacity-40 cursor-not-allowed"
//                     : "hover:bg-gray-50"
//                 }`}
//               >
//                 <span className="font-medium text-gray-800">
//                   {config.label}
//                 </span>
//                 <span className="text-xs text-gray-400">{config.hint}</span>
//               </button>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// import { Plus } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { useTemplateStore } from "../../../store/template-builder.store";

// export const AddButtonAction = () => {
//   const { buttonStrategy, buttons, addButton } = useTemplateStore();

//   if (buttonStrategy === "No Buttons" || buttons.length >= 10) {
//     return null;
//   }

//   return (
//     <Button className="actions-btn text-xs!" onClick={addButton}>
//       <Plus size={14} />
//       Add Button
//     </Button>
//   );
// };
