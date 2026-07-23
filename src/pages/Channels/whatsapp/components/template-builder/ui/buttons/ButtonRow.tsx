import type { TemplateButton } from "../../../../types/template.type";
import { CallToActionButtonEditor } from "./editors/CallToActionButtonEditor";
import { QuickReplyButtonEditor } from "./editors/QuickReplyButtonEditor";
// import { UrlButtonEditor } from "./editors/UrlButtonEditor";

interface IButtonRowProps {
  button: TemplateButton;
}

export function ButtonRow({ button }: IButtonRowProps) {
  if (button.kind === "QUICK_REPLY") {
    return <QuickReplyButtonEditor button={button} />;
  }

  return <CallToActionButtonEditor button={button} />;
}

// import { Info, X } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import type { ButtonKind, TemplateButton } from "../../../types/template.type";
// import { BUTTON_TYPE_CONFIG } from "../../../constants/template.constants";

// const COUNTRY_CODES = [
//   { value: "+1", label: "US +1" },
//   { value: "+91", label: "IN +91" },
//   { value: "+44", label: "UK +44" },
//   { value: "+61", label: "AU +61" },
// ];

// const ACTIVE_FOR_OPTIONS = ["7 days", "30 days", "90 days", "Off"];

// interface IButtonRowProps {
//   button: TemplateButton;
//   error?: string;
//   availableKinds: ButtonKind[]; // this row's current kind + any kind still under its limit
//   onUpdate: (id: string, field: string, value: string | boolean) => void;
//   onKindChange: (id: string, kind: ButtonKind) => void;
//   onRemove: (id: string) => void;
// }

// const FieldGroup = ({
//   label,
//   error,
//   children,
// }: {
//   label: string;
//   error?: string;
//   children: React.ReactNode;
// }) => (
//   <div>
//     <label className="text-xs font-medium text-gray-600 block mb-1">
//       {label}
//     </label>
//     {children}
//     {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
//   </div>
// );

// export const ButtonRow = ({
//   button,
//   error,
//   availableKinds,
//   onUpdate,
//   onKindChange,
//   onRemove,
// }: IButtonRowProps) => {
//   const renderFields = () => {
//     switch (button.kind) {
//       case "QUICK_REPLY":
//         return (
//           <FieldGroup label="Button text" error={error}>
//             <Input
//               value={button.label}
//               onChange={(e) => onUpdate(button.id, "label", e.target.value)}
//               maxLength={25}
//               placeholder="e.g. Yes"
//             />
//           </FieldGroup>
//         );

//       case "URL":
//         return (
//           <>
//             <div className="grid grid-cols-2 gap-3">
//               <FieldGroup label="Button text" error={error}>
//                 <Input
//                   value={button.label}
//                   onChange={(e) => onUpdate(button.id, "label", e.target.value)}
//                   maxLength={25}
//                   placeholder="Visit website"
//                 />
//               </FieldGroup>
//               <FieldGroup label="URL type">
//                 <Select
//                   value={button.urlType ?? "STATIC"}
//                   onValueChange={(v) => onUpdate(button.id, "urlType", v)}
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="STATIC">Static</SelectItem>
//                     <SelectItem value="DYNAMIC">Dynamic</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </FieldGroup>
//             </div>
//             <FieldGroup label="Website URL">
//               <Input
//                 value={button.value}
//                 onChange={(e) => onUpdate(button.id, "value", e.target.value)}
//                 placeholder="https://example.com"
//               />
//             </FieldGroup>
//             <label className="flex items-center gap-2 text-xs text-gray-600">
//               <Checkbox
//                 checked={button.trackConversions ?? false}
//                 onCheckedChange={(v) =>
//                   onUpdate(button.id, "trackConversions", !!v)
//                 }
//               />
//               Track app conversions (Marketing Messages API for WhatsApp only)
//             </label>
//           </>
//         );

//       case "PHONE_NUMBER":
//         return (
//           <>
//             <div className="grid grid-cols-2 gap-3">
//               <FieldGroup label="Button text" error={error}>
//                 <Input
//                   value={button.label}
//                   onChange={(e) => onUpdate(button.id, "label", e.target.value)}
//                   maxLength={25}
//                   placeholder="Call phone number"
//                 />
//               </FieldGroup>
//               <FieldGroup label="Country">
//                 <Select
//                   value={button.countryCode ?? "+1"}
//                   onValueChange={(v) => onUpdate(button.id, "countryCode", v)}
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {COUNTRY_CODES.map((c) => (
//                       <SelectItem key={c.value} value={c.value}>
//                         {c.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </FieldGroup>
//             </div>
//             <FieldGroup
//               label="Phone number"
//               error={
//                 !button.value ? "You need to enter a phone number." : undefined
//               }
//             >
//               <Input
//                 value={button.value}
//                 onChange={(e) => onUpdate(button.id, "value", e.target.value)}
//                 placeholder="9876543210"
//               />
//             </FieldGroup>
//           </>
//         );

//       case "CALL_ON_WHATSAPP":
//         return (
//           <>
//             <div className="grid grid-cols-2 gap-3">
//               <FieldGroup label="Button text" error={error}>
//                 <Input
//                   value={button.label}
//                   onChange={(e) => onUpdate(button.id, "label", e.target.value)}
//                   maxLength={25}
//                   placeholder="Call on WhatsApp"
//                 />
//               </FieldGroup>
//               <FieldGroup label="Active for">
//                 <Select
//                   value={button.activeFor ?? "7 days"}
//                   onValueChange={(v) => onUpdate(button.id, "activeFor", v)}
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {ACTIVE_FOR_OPTIONS.map((o) => (
//                       <SelectItem key={o} value={o}>
//                         {o}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </FieldGroup>
//             </div>
//             <div className="flex gap-2 rounded-lg bg-blue-50 p-3 text-xs text-gray-600">
//               <Info size={14} className="shrink-0 mt-0.5 text-blue-500" />
//               <p>
//                 Turn on calling in the{" "}
//                 <a href="#" className="text-blue-600 underline">
//                   WhatsApp Manager portal
//                 </a>
//                 . Alternatively, you can use the Phone Number Settings API.{" "}
//                 <a href="#" className="text-blue-600 underline block mt-1">
//                   About calling on WhatsApp
//                 </a>
//               </p>
//             </div>
//           </>
//         );

//       case "COPY_CODE":
//         return (
//           <>
//             <FieldGroup label="Button text">
//               <Input value="Copy offer code" disabled />
//             </FieldGroup>
//             <FieldGroup label="Sample offer code">
//               <Input
//                 value={button.value}
//                 onChange={(e) => onUpdate(button.id, "value", e.target.value)}
//                 placeholder="e.g. SAVE20"
//               />
//             </FieldGroup>
//           </>
//         );

//       case "SHARE_CONTACT":
//         return (
//           <FieldGroup label="Button text" error={error}>
//             <Input
//               value={button.label}
//               onChange={(e) => onUpdate(button.id, "label", e.target.value)}
//               maxLength={25}
//               placeholder="Share contact info"
//             />
//           </FieldGroup>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="border border-gray-200 rounded-lg p-3 space-y-3">
//       <div className="flex items-start justify-between gap-3">
//         <div className="flex-1 space-y-3">
//           <FieldGroup label="Type of action">
//             <Select
//               value={button.kind}
//               onValueChange={(v) => onKindChange(button.id, v as ButtonKind)}
//             >
//               <SelectTrigger className="w-full">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {availableKinds?.map((k) => (
//                   <SelectItem key={k} value={k}>
//                     {BUTTON_TYPE_CONFIG[k].label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </FieldGroup>

//           {renderFields()}
//         </div>

//         <button
//           onClick={() => onRemove(button.id)}
//           className="text-gray-400 hover:text-red-500 mt-6"
//         >
//           <X size={16} />
//         </button>
//       </div>
//     </div>
//   );
// };

// import { Trash2 } from "lucide-react";
// import { QuickReplyButtonEditor } from "./editors/QuickReplyButtonEditor";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { Button } from "@/components/ui/button";
// import type { TemplateButton } from "../../../types/template.type";

// const BUTTON_TYPES = ["URL Button", "Phone Button", "Quick Reply"];

// interface ButtonRowProps {
//   id: string;
//   type: "URL Button" | "Phone Button" | "Quick Reply";
//   label: string;
//   value: string;

//   onUpdate: (id: string, field: keyof TemplateButton, value: string) => void;

//   onRemove: (id: string) => void;
// }

// export const ButtonRow = ({
//   id,
//   type,
//   label,
//   value,
//   onUpdate,
//   onRemove,
// }: ButtonRowProps) => {
//   return (
//     <div className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
//       {/* <GripVertical size={14} className="text-gray-300 cursor-grab shrink-0" /> */}
//       <select
//         value={type}
//         onChange={(e) => onUpdate(id, "type", e.target.value)}
//         className="border border-gray-200 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
//       >
//         {BUTTON_TYPES.map((t) => (
//           <option key={t} value={t}>
//             {t}
//           </option>
//         ))}
//       </select>
//       <input
//         value={label}
//         onChange={(e) => onUpdate(id, "label", e.target.value)}
//         placeholder="Button label"
//         className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
//       />
//       <input
//         value={value}
//         onChange={(e) => onUpdate(id, "value", e.target.value)}
//         placeholder={
//           type === "URL Button"
//             ? "https://..."
//             : type === "Phone Button"
//               ? "+91..."
//               : "PAYLOAD"
//         }
//         className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
//       />
//       <div className="flex gap-1 shrink-0">
//         <Button
//           onClick={() => onRemove(id)}
//           className="text-gray-400 hover:text-red-500 transition-colors bg-transparent! h-4! px-0!"
//         >
//           <Trash2 size={13} />
//         </Button>
//       </div>
//     </div>
//   );
// };
