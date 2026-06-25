// import React from "react";
// import { ChevronDown, Plus, Trash2, Pencil, GripVertical } from "lucide-react";
// import { useTemplateStore } from "../../store/template-builder.store";
// import type { ButtonStrategy, ButtonType } from "../../types/template.type";

// const BUTTON_STRATEGIES: ButtonStrategy[] = [
//   "No Buttons",
//   "Quick Replies",
//   "Call To Action",
//   "Mixed Actions",
//   "Flow",
// ];
// const BUTTON_TYPES: ButtonType[] = [
//   "URL Button",
//   "Phone Button",
//   "Quick Reply",
// ];
// const HEADER_TYPES = ["Text", "Image", "Video", "Document"] as const;

// // ── Reusable Variable Row ──────────────────────────────────────
// interface VarRowProps {
//   index: number;
//   id: string;
//   name: string;
//   exampleValue: string;
//   onUpdate: (id: string, field: "name" | "exampleValue", value: string) => void;
//   onRemove: (id: string) => void;
// }
// const VariableRow: React.FC<VarRowProps> = ({
//   index,
//   id,
//   name,
//   exampleValue,
//   onUpdate,
//   onRemove,
// }) => (
//   <div className="grid grid-cols-[32px_1fr_1fr_40px] gap-2 items-center text-sm py-1.5 border-b border-gray-100 last:border-0">
//     <span className="text-gray-500 text-center">{index}</span>
//     <input
//       value={name}
//       onChange={(e) => onUpdate(id, "name", e.target.value)}
//       placeholder="variable_name"
//       className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
//     />
//     <input
//       value={exampleValue}
//       onChange={(e) => onUpdate(id, "exampleValue", e.target.value)}
//       placeholder="Example value"
//       className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
//     />
//     <div className="flex gap-1 justify-center">
//       <button
//         onClick={() => onRemove(id)}
//         className="text-gray-400 hover:text-red-500 transition-colors"
//       >
//         <Trash2 size={13} />
//       </button>
//     </div>
//   </div>
// );

// // ── Header for variable section ────────────────────────────────
// const VarSectionHeader: React.FC<{ count: number }> = ({ count }) => (
//   <div className="grid grid-cols-[32px_1fr_1fr_40px] gap-2 items-center text-xs font-medium text-gray-500 border-b border-gray-200 pb-1.5 mt-2">
//     <span className="text-center">#</span>
//     <span>Variable Name</span>
//     <span>Example Value</span>
//     <span>Actions</span>
//   </div>
// );

// // ── Button Row ─────────────────────────────────────────────────
// interface ButtonRowProps {
//   id: string;
//   type: ButtonType;
//   label: string;
//   value: string;
//   onUpdate: (id: string, field: string, value: string) => void;
//   onRemove: (id: string) => void;
// }
// const ButtonRow: React.FC<ButtonRowProps> = ({
//   id,
//   type,
//   label,
//   value,
//   onUpdate,
//   onRemove,
// }) => (
//   <div className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
//     <GripVertical
//       size={14}
//       className="text-gray-300 cursor-grab flex-shrink-0"
//     />
//     <select
//       value={type}
//       onChange={(e) => onUpdate(id, "type", e.target.value)}
//       className="border border-gray-200 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
//     >
//       {BUTTON_TYPES.map((t) => (
//         <option key={t} value={t}>
//           {t}
//         </option>
//       ))}
//     </select>
//     <input
//       value={label}
//       onChange={(e) => onUpdate(id, "label", e.target.value)}
//       placeholder="Button label"
//       className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
//     />
//     <input
//       value={value}
//       onChange={(e) => onUpdate(id, "value", e.target.value)}
//       placeholder={
//         type === "URL Button"
//           ? "https://..."
//           : type === "Phone Button"
//             ? "+91..."
//             : "PAYLOAD"
//       }
//       className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
//     />
//     <div className="flex gap-1 flex-shrink-0">
//       <button className="text-gray-400 hover:text-blue-500 transition-colors">
//         <Pencil size={13} />
//       </button>
//       <button
//         onClick={() => onRemove(id)}
//         className="text-gray-400 hover:text-red-500 transition-colors"
//       >
//         <Trash2 size={13} />
//       </button>
//     </div>
//   </div>
// );

// // ── Main Component ─────────────────────────────────────────────
// export const TemplateComposerPanel: React.FC = () => {
//   const {
//     headerType,
//     setHeaderType,
//     headerText,
//     setHeaderText,
//     headerVariables,
//     addHeaderVariable,
//     updateHeaderVariable,
//     removeHeaderVariable,

//     bodyText,
//     setBodyText,
//     bodyVariables,
//     addBodyVariable,
//     updateBodyVariable,
//     removeBodyVariable,

//     footerText,
//     setFooterText,

//     buttonStrategy,
//     setButtonStrategy,
//     buttons,
//     addButton,
//     updateButton,
//     removeButton,
//   } = useTemplateStore();

//   const bodyMaxLen = 1024;
//   const headerMaxLen = 60;
//   const footerMaxLen = 60;

//   return (
//     <div className="flex flex-col gap-5">
//       {/* ── Header ─────────────────────────────────────── */}
//       <section className="border border-gray-200 rounded-xl p-4">
//         <div className="flex items-center justify-between mb-3">
//           <div>
//             <span className="font-semibold text-sm text-gray-800">Header</span>
//             <span className="ml-2 text-xs text-gray-400">(Optional)</span>
//           </div>
//           <button
//             onClick={addHeaderVariable}
//             className="flex items-center gap-1.5 text-xs text-green-700 font-medium border border-green-300 rounded-lg px-2.5 py-1.5 hover:bg-green-50 transition-colors"
//           >
//             <Pencil size={12} /> Add Variable
//           </button>
//         </div>

//         <div className="flex gap-2 mb-2">
//           <div className="relative">
//             <select
//               value={headerType}
//               onChange={(e) => setHeaderType(e.target.value as any)}
//               className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white appearance-none pr-7 focus:outline-none focus:ring-2 focus:ring-green-500"
//             >
//               {HEADER_TYPES.map((t) => (
//                 <option key={t} value={t}>
//                   {t}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown
//               size={13}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//             />
//           </div>
//           {headerType === "Text" && (
//             <div className="relative flex-1">
//               <textarea
//                 value={headerText}
//                 onChange={(e) => setHeaderText(e.target.value)}
//                 maxLength={headerMaxLen}
//                 rows={2}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//               <span className="absolute right-2 bottom-2 text-xs text-gray-400">
//                 {headerText.length}/{headerMaxLen}
//               </span>
//             </div>
//           )}
//         </div>

//         <p className="text-xs text-blue-500 flex items-center gap-1 mb-2">
//           <span>ℹ️</span> Text headers support 1 variable only.
//         </p>

//         {headerVariables.length > 0 && (
//           <div>
//             <p className="text-xs font-semibold text-green-700 mb-1">
//               Manage Variables ({headerVariables.length})
//             </p>
//             <VarSectionHeader count={headerVariables.length} />
//             {headerVariables.map((v, i) => (
//               <VariableRow
//                 key={v.id}
//                 index={i + 1}
//                 id={v.id}
//                 name={v.name}
//                 exampleValue={v.exampleValue}
//                 onUpdate={updateHeaderVariable}
//                 onRemove={removeHeaderVariable}
//               />
//             ))}
//           </div>
//         )}
//       </section>

//       {/* ── Body ───────────────────────────────────────── */}
//       <section className="border border-gray-200 rounded-xl p-4">
//         <div className="flex items-center justify-between mb-3">
//           <span className="font-semibold text-sm text-gray-800">Body</span>
//           <button
//             onClick={addBodyVariable}
//             className="flex items-center gap-1.5 text-xs text-green-700 font-medium border border-green-300 rounded-lg px-2.5 py-1.5 hover:bg-green-50 transition-colors"
//           >
//             <Pencil size={12} /> Add Variable
//           </button>
//         </div>

//         <div className="relative mb-2">
//           <textarea
//             value={bodyText}
//             onChange={(e) => setBodyText(e.target.value)}
//             maxLength={bodyMaxLen}
//             rows={5}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
//             placeholder="Enter your message body. Use {{1}}, {{2}} for variables."
//           />
//           <span className="absolute right-2 bottom-2 text-xs text-gray-400">
//             {bodyText.length}/{bodyMaxLen}
//           </span>
//         </div>

//         {bodyVariables.length > 0 && (
//           <div>
//             <p className="text-xs font-semibold text-green-700 mb-1">
//               Manage Variables ({bodyVariables.length})
//             </p>
//             <VarSectionHeader count={bodyVariables.length} />
//             {bodyVariables.map((v, i) => (
//               <VariableRow
//                 key={v.id}
//                 index={i + 1}
//                 id={v.id}
//                 name={v.name}
//                 exampleValue={v.exampleValue}
//                 onUpdate={updateBodyVariable}
//                 onRemove={removeBodyVariable}
//               />
//             ))}
//           </div>
//         )}
//       </section>

//       {/* ── Footer ─────────────────────────────────────── */}
//       <section className="border border-gray-200 rounded-xl p-4">
//         <div className="flex items-center justify-between mb-3">
//           <div>
//             <span className="font-semibold text-sm text-gray-800">Footer</span>
//             <span className="ml-2 text-xs text-gray-400">(Optional)</span>
//           </div>
//         </div>
//         <div className="relative">
//           <input
//             type="text"
//             value={footerText}
//             onChange={(e) => setFooterText(e.target.value)}
//             maxLength={footerMaxLen}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//             placeholder="Footer text (optional)"
//           />
//           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
//             {footerText.length}/{footerMaxLen}
//           </span>
//         </div>
//       </section>

//       {/* ── Buttons ────────────────────────────────────── */}
//       <section className="border border-gray-200 rounded-xl p-4">
//         <div className="flex items-center justify-between mb-1">
//           <div>
//             <span className="font-semibold text-sm text-gray-800">Buttons</span>
//             <span className="ml-2 text-xs text-gray-400">(Optional)</span>
//           </div>
//           <button className="text-xs text-blue-600 underline">
//             Button Guidelines ↗
//           </button>
//         </div>
//         <p className="text-xs text-gray-400 mb-3">
//           Add buttons to encourage action. Maximum 10 buttons allowed.
//         </p>

//         {/* Strategy Selector */}
//         <div className="flex flex-wrap gap-1.5 mb-4">
//           {BUTTON_STRATEGIES.map((s) => (
//             <button
//               key={s}
//               onClick={() => setButtonStrategy(s)}
//               className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
//                 buttonStrategy === s
//                   ? "bg-green-600 text-white border-green-600"
//                   : "bg-white text-gray-600 border-gray-300 hover:border-green-400 hover:text-green-700"
//               }`}
//             >
//               {s}
//             </button>
//           ))}
//         </div>

//         {/* Button Rows */}
//         {buttons.length > 0 && (
//           <div className="mb-3">
//             {buttons.map((btn) => (
//               <ButtonRow
//                 key={btn.id}
//                 id={btn.id}
//                 type={btn.type}
//                 label={btn.label}
//                 value={btn.value}
//                 onUpdate={updateButton}
//                 onRemove={removeButton}
//               />
//             ))}
//           </div>
//         )}

//         {buttonStrategy !== "No Buttons" && buttons.length < 10 && (
//           <button
//             onClick={addButton}
//             className="flex items-center gap-1.5 text-sm text-green-700 font-medium hover:text-green-800"
//           >
//             <Plus size={14} /> Add Button
//           </button>
//         )}
//       </section>
//     </div>
//   );
// };

import { BodyEditor } from "./content/BodyEditor";
import { ButtonsEditor } from "./content/ButtonEditor";
import { FooterEditor } from "./content/FooterEditor";
import { HeaderEditor } from "./content/HeaderEditor";

export const TemplateComposerPanel = () => {
  return (
    <div className="space-y-4">
      <HeaderEditor />
      <BodyEditor />
      <FooterEditor />
      <ButtonsEditor />
    </div>
  );
};
