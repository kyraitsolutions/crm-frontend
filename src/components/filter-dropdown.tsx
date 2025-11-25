import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export interface Option {
  label: string;
  value: string | null;
}

interface FilterDropdownProps {
  label: string; // currently selected label
  options: Option[];
  onSelect: (value: Option) => void; // return the value
  allLabel?: string; // default label for "All" selection
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  onSelect,
  allLabel,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {label}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {allLabel && (
          <DropdownMenuItem
            onClick={() => onSelect({ label: allLabel, value: "" })}
          >
            {allLabel}
          </DropdownMenuItem>
        )}
        {options.map((option) => (
          <DropdownMenuItem key={option.value} onClick={() => onSelect(option)}>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
