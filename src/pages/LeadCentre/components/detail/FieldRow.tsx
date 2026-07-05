import { useEffect, useState } from "react";
import { Check, Pencil, Phone, X } from "lucide-react";
import { useLeadsStore } from "../../store/lead.store";
// import { useAuthStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FieldRowProps {
  label: string;
  value: string;
  fieldKey: string;
  leadId?: string;
  isPhone?: boolean;
  onChange: (value: string) => void;
  type?: "text" | "textarea";
}

export const FieldRow = ({
  label,
  value,
  fieldKey,
  isPhone,
  type = "text",
  onChange,
}: FieldRowProps) => {
  // const { accountId } = useAuthStore((state) => state);
  const { editingField, setEditingField, updatingLead } = useLeadsStore(
    (state) => state,
  );
  const [tempValue, setTempValue] = useState(value);
  //   const [loading, setLoading] = useState(false);

  const isEditing = editingField === fieldKey;
  //   const isAssignedField = fieldKey === "assignedTo";

  useEffect(() => {
    setTempValue(value);
    setEditingField(null);
  }, [value]);

  const handleSave = async () => {
    if (tempValue === value) {
      setEditingField(null);
      return;
    }

    onChange(tempValue);
  };

  const handleCancel = () => {
    setTempValue(value);
    setEditingField(null);
  };

  return (
    <div className="grid md:grid-cols-[160px_1fr] grid-cols-2 items-center">
      <span className="text-gray-500 text-sm">{label}</span>

      <div className="group flex items-center gap-4 max-w-100 w-full">
        <div
          className={`flex items-center gap-2 rounded-xl border transition w-full ${isEditing ? "ring-1 ring-primary/40!" : "border-transparent hover:border-primary/20"}`}
        >
          {type === "text" && (
            <Input
              type="text"
              value={tempValue}
              readOnly={!isEditing}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full px-2 py-2 bg-transparent outline-none text-sm border-none! input-field"
            />
          )}

          {type === "textarea" && (
            <Textarea
              value={tempValue}
              readOnly={!isEditing}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full px-2 py-2 bg-transparent outline-none text-sm border-none! input-field resize-none"
            />
          )}

          {isPhone && !isEditing && (
            <button className="bg-primary/10 p-1.5 rounded-md mr-2">
              <Phone className="text-primary" size={14} />
            </button>
          )}
        </div>

        {!isEditing && (
          <Button
            onClick={() => setEditingField(fieldKey)}
            className="opacity-0 group-hover:opacity-100 transition bg-transparent! text-primary!"
          >
            <Pencil size={16} />
          </Button>
        )}

        {isEditing && (
          <div className="flex items-center gap-2">
            <button
              disabled={updatingLead}
              onClick={handleSave}
              className="text-primary cursor-pointer"
            >
              <Check size={18} />
            </button>

            <button onClick={handleCancel}>
              <X size={18} className="text-red-400 cursor-pointer" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
