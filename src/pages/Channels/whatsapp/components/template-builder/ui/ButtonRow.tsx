import { Trash2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import type { ButtonType, TemplateButton } from "../../../types/template.type";

const BUTTON_TYPES: ButtonType[] = [
  "URL Button",
  "Phone Button",
  "Quick Reply",
];

interface ButtonRowProps {
  id: string;
  type: ButtonType;
  label: string;
  value: string;

  onUpdate: (id: string, field: keyof TemplateButton, value: string) => void;

  onRemove: (id: string) => void;
}

export const ButtonRow = ({
  id,
  type,
  label,
  value,
  onUpdate,
  onRemove,
}: ButtonRowProps) => {
  return (
    <div className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
      {/* <GripVertical size={14} className="text-gray-300 cursor-grab shrink-0" /> */}
      <select
        value={type}
        onChange={(e) => onUpdate(id, "type", e.target.value)}
        className="border border-gray-200 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
      >
        {BUTTON_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <input
        value={label}
        onChange={(e) => onUpdate(id, "label", e.target.value)}
        placeholder="Button label"
        className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
      />
      <input
        value={value}
        onChange={(e) => onUpdate(id, "value", e.target.value)}
        placeholder={
          type === "URL Button"
            ? "https://..."
            : type === "Phone Button"
              ? "+91..."
              : "PAYLOAD"
        }
        className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
      />
      <div className="flex gap-1 shrink-0">
        <Button
          onClick={() => onRemove(id)}
          className="text-gray-400 hover:text-red-500 transition-colors bg-transparent! h-4! px-0!"
        >
          <Trash2 size={13} />
        </Button>
      </div>
    </div>
  );
};
