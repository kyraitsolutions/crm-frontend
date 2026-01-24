"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type Option = {
  id: string;
  label: string;
};

interface MultiSelectDropdownProps {
  options: Option[];
  value?: string[];
  placeholder?: string;
  onChange: (selected: string[]) => void;
  isSelectable?: boolean;
}

export const MultiSelectDropdown = ({
  options,
  value = [],
  placeholder = "Select options",
  isSelectable,
  onChange,
}: MultiSelectDropdownProps) => {
  const [selected, setSelected] = useState<string[]>(value);

  const toggleSelection = (id: string) => {
    let updated;

    if (selected.includes(id)) {
      updated = selected.filter((item) => item !== id);
    } else {
      updated = [...selected, id];
    }

    setSelected(updated);
    onChange(updated);
  };

  const selectedLabels = options
    .filter((o) => selected.includes(o.id))
    .map((o) => o.label)
    .join(", ");

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-max">
          {selectedLabels || placeholder}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        {options.map((opt) => (
          <DropdownMenuCheckboxItem
            key={opt.id}
            checked={selected.includes(opt.id)}
            onClick={() => isSelectable && toggleSelection(opt.id)}
            onSelect={(e) => e.preventDefault()}
          >
            {opt.label}

            {/* <Trash2 size={10} onClick={(e) => { e.stopPropagation(), handleDelete(opt.id) }} /> */}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
