import React from "react";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface VariableRowProps {
  index: number;
  id: string;
  name: string;
  exampleValue: string;
  onUpdate: (id: string, field: "name" | "exampleValue", value: string) => void;
  onRemove: (id: string) => void;
}

export const VariableRow: React.FC<VariableRowProps> = ({
  index,
  id,
  name,
  exampleValue,
  onUpdate,
  onRemove,
}) => (
  <div className="grid grid-cols-[32px_1fr_1fr_40px] gap-2 items-center py-1.5 border-b border-gray-100 last:border-0">
    <span className="text-xs text-gray-500 text-center">{index}</span>
    <Input
      className="input-field h-7 text-xs"
      value={name}
      onChange={(e) => onUpdate(id, "name", e.target.value)}
      placeholder="variable_name"
    />
    <Input
      className="input-field h-7 text-xs"
      value={exampleValue}
      onChange={(e) => onUpdate(id, "exampleValue", e.target.value)}
      placeholder="Example value"
    />
    <div className="flex justify-center">
      <button
        onClick={() => onRemove(id)}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 size={13} />
      </button>
    </div>
  </div>
);
