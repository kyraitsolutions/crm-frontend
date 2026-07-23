import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES } from "@/constants";
import React from "react";
import {
  getBodyCursorPos,
  useTemplateStore,
} from "../../store/template-builder.store";
import { VariablesLibrary } from "./ui/Variableslibrary";
// import { CategoryGuidelines } from "./CategoryGuidelines";
// import { VariablesLibrary } from "./VariablesLibrary";

export const TemplateDetailsPanel: React.FC = () => {
  const {
    templateName,
    setTemplateName,
    language,
    setLanguage,
    suggestedVariables,
    insertVariableToBody,
  } = useTemplateStore();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""));
  };

  const handleInsert = (varName: string) => {
    insertVariableToBody(varName, getBodyCursorPos());
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        {/* Template Name */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Template Name
          </label>
          <div className="relative">
            <Input
              className="input-field pr-14"
              type="text"
              value={templateName}
              onChange={handleNameChange}
              maxLength={512}
              placeholder="e.g. order_confirmation"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
              {templateName.length}/512
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Use lowercase letters and underscores only.
          </p>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <Select
            value={language}
            onValueChange={(val) => setLanguage(val as string)}
          >
            <SelectTrigger className="input-field w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-400 mt-1">
            Select the language for your template.
          </p>
        </div>
      </div>

      {/* Variables Library */}
      {/* <VariablesLibrary
        suggestedVariables={suggestedVariables}
        onInsert={handleInsert}
      /> */}
    </div>
  );
};

// import React from "react";
// import { Plus } from "lucide-react";
// import { useTemplateStore } from "../../store/template-builder.store";
// import type {
//   TemplateCategory,
//   TemplateLanguage,
// } from "../../types/template.type";

// const CATEGORIES: TemplateCategory[] = [
//   "Marketing",
//   "Utility",
//   "Authentication",
// ];
// const LANGUAGES: TemplateLanguage[] = [
//   "English (US)",
//   "Hindi",
//   "Spanish",
//   "French",
// ];
// const TYPES = ["Marketing", "Utility", "Authentication"] as const;

// const UTILITY_COMPONENTS = {
//   allowed: [
//     "Header",
//     "Body",
//     "Footer",
//     "Quick Reply Buttons",
//     "URL Button",
//     "Phone Number Button",
//   ],
//   disallowed: ["Copy Code Button", "OTP Button"],
// };

// export const TemplateDetailsPanel: React.FC = () => {
//   const {
//     templateName,
//     setTemplateName,
//     category,
//     setCategory,
//     language,
//     setLanguage,
//     templateType,
//     setTemplateType,
//     suggestedVariables,
//     insertVariableToBody,
//   } = useTemplateStore();

//   const [varTab, setVarTab] = React.useState<"Suggested" | "Custom">(
//     "Suggested",
//   );
//   const [customVarInput, setCustomVarInput] = React.useState("");
//   const [customVars, setCustomVars] = React.useState<string[]>([]);

//   const handleAddCustomVar = () => {
//     if (!customVarInput.trim()) return;
//     const formatted = customVarInput.trim().toLowerCase().replace(/\s+/g, "_");
//     setCustomVars((prev) => [...prev, formatted]);
//     setCustomVarInput("");
//   };

//   return (
//     <div className="flex flex-col gap-5">
//       {/* Template Name */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Template Name
//         </label>
//         <div className="relative">
//           <input
//             type="text"
//             value={templateName}
//             onChange={(e) =>
//               setTemplateName(e.target.value.toLowerCase().replace(/\s+/g, "_"))
//             }
//             maxLength={512}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//           />
//           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
//             {templateName.length}/512
//           </span>
//         </div>
//         <p className="text-xs text-gray-400 mt-1">
//           Use lowercase letters and underscores only.
//         </p>
//       </div>

//       {/* Category */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Category
//         </label>
//         <div className="relative">
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value as TemplateCategory)}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white appearance-none"
//           >
//             {CATEGORIES.map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>
//         </div>
//         <p className="text-xs text-gray-400 mt-1">
//           Choose the category that best fits your message.
//         </p>

//         {/* Category Guidelines */}
//         <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50 p-3">
//           <div className="flex items-center gap-2 mb-1">
//             <span className="text-blue-500">ℹ️</span>
//             <span className="text-sm font-medium text-blue-700">
//               Category Guidelines
//             </span>
//           </div>
//           <p className="text-xs text-blue-600 mb-1">
//             Utility templates are for order updates, account alerts,
//             transactions and more.
//           </p>
//           <button className="text-xs text-blue-600 underline font-medium">
//             View Details ↗
//           </button>
//         </div>
//       </div>

//       {/* Language */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Language
//         </label>
//         <select
//           value={language}
//           onChange={(e) => setLanguage(e.target.value as TemplateLanguage)}
//           className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white appearance-none"
//         >
//           {LANGUAGES.map((l) => (
//             <option key={l} value={l}>
//               {l}
//             </option>
//           ))}
//         </select>
//         <p className="text-xs text-gray-400 mt-1">
//           Select the language for your template.
//         </p>
//       </div>

//       {/* Template Type */}
//       {/* <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Template Type
//         </label>
//         <div className="flex rounded-lg border border-gray-300 overflow-hidden">
//           {TYPES.map((t) => (
//             <button
//               key={t}
//               onClick={() => setTemplateType(t)}
//               className={`flex-1 py-2 text-sm font-medium transition-colors ${
//                 templateType === t
//                   ? "bg-green-600 text-white"
//                   : "bg-white text-gray-600 hover:bg-gray-50"
//               }`}
//             >
//               {t}
//             </button>
//           ))}
//         </div>

//         <div className="mt-3">
//           <p className="text-xs font-medium text-gray-600 mb-2">
//             Allowed Components in Utility
//           </p>
//           <div className="grid grid-cols-2 gap-x-3 gap-y-1">
//             {UTILITY_COMPONENTS.allowed.map((c) => (
//               <div
//                 key={c}
//                 className="flex items-center gap-1.5 text-xs text-gray-700"
//               >
//                 <span className="text-green-500">✓</span> {c}
//               </div>
//             ))}
//             {UTILITY_COMPONENTS.disallowed.map((c) => (
//               <div
//                 key={c}
//                 className="flex items-center gap-1.5 text-xs text-gray-500"
//               >
//                 <span className="text-red-400">✗</span> {c}
//               </div>
//             ))}
//           </div>
//           <button className="text-xs text-blue-600 underline mt-2">
//             Learn about categories ↗
//           </button>
//         </div>
//       </div> */}

//       {/* Variables Library */}
//       <div>
//         <h3 className="text-sm font-semibold text-gray-800 mb-0.5">
//           Variables Library
//         </h3>
//         <p className="text-xs text-gray-500 mb-2">
//           Use variables to personalize your message.
//         </p>

//         {/* Tabs */}
//         <div className="flex border-b border-gray-200 mb-3">
//           {(["Suggested", "Custom"] as const).map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setVarTab(tab)}
//               className={`pb-2 px-3 text-sm font-medium transition-colors ${
//                 varTab === tab
//                   ? "border-b-2 border-green-600 text-green-700"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {varTab === "Suggested" ? (
//           <div className="flex flex-wrap gap-2">
//             {suggestedVariables.map((v) => (
//               <button
//                 key={v}
//                 onClick={() => insertVariableToBody(v)}
//                 className="px-2.5 py-1 rounded-full border border-gray-300 text-xs text-gray-700 hover:border-green-500 hover:text-green-700 hover:bg-green-50 transition-colors"
//               >
//                 {v.startsWith("order_") ||
//                 v.startsWith("tracking_") ||
//                 v.startsWith("appointment_") ||
//                 v === "order_id" ||
//                 v === "order_date"
//                   ? `+ ${v}`
//                   : v}
//               </button>
//             ))}
//           </div>
//         ) : (
//           <div>
//             <div className="flex gap-2 mb-2">
//               <input
//                 type="text"
//                 value={customVarInput}
//                 onChange={(e) => setCustomVarInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleAddCustomVar()}
//                 placeholder="Enter variable name"
//                 className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//               <button
//                 onClick={handleAddCustomVar}
//                 className="px-3 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700"
//               >
//                 Add
//               </button>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {customVars.map((v) => (
//                 <button
//                   key={v}
//                   onClick={() => insertVariableToBody(v)}
//                   className="px-2.5 py-1 rounded-full border border-green-300 text-xs text-green-700 hover:bg-green-50"
//                 >
//                   + {v}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         <button className="mt-3 flex items-center gap-1.5 text-sm text-green-700 font-medium hover:text-green-800">
//           <Plus size={14} />
//           Add Custom Variable
//         </button>
//       </div>
//     </div>
//   );
// };
