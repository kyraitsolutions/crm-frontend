// import React, { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { VariableChip } from "./VariableChip";

// interface CustomVariablesProps {
//   onInsert: (varName: string) => void;
// }

// export const CustomVariables: React.FC<CustomVariablesProps> = ({
//   onInsert,
// }) => {
//   const [inputValue, setInputValue] = useState("");
//   const [customVars, setCustomVars] = useState<string[]>([]);

//   const handleAdd = () => {
//     const trimmed = inputValue.trim();
//     if (!trimmed) return;

//     const formatted = trimmed.toLowerCase().replace(/\s+/g, "_");

//     // Avoid duplicates
//     if (customVars.includes(formatted)) {
//       setInputValue("");
//       return;
//     }

//     setCustomVars((prev) => [...prev, formatted]);
//     setInputValue("");
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleAdd();
//     }
//   };

//   return (
//     <div className="flex flex-col gap-3">
//       {/* Input row */}
//       <div className="flex gap-2 items-center">
//         <Input
//           className="input-field flex-1 text-xs h-8"
//           placeholder="Enter variable name (e.g. order_id)"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyDown={handleKeyDown}
//         />
//         <Button
//           size="sm"
//           variant="default"
//           className="bg-green-600 hover:bg-green-700 text-white text-xs h-8 px-3"
//           onClick={handleAdd}
//         >
//           Add
//         </Button>
//       </div>

//       {/* Custom var chips */}
//       {customVars.length > 0 ? (
//         <div className="flex flex-wrap gap-2">
//           {customVars.map((v) => (
//             <VariableChip
//               key={v}
//               label={`+ ${v}`}
//               onClick={() => onInsert(v)}
//               variant="custom"
//             />
//           ))}
//         </div>
//       ) : (
//         <p className="text-xs text-gray-400 italic">
//           No custom variables yet. Type a name above and press Add.
//         </p>
//       )}
//     </div>
//   );
// };
