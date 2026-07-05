import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  label: string;
  value: string;
}

interface SelectFieldRowProps {
  label: string;
  value?: string;
  options: Option[];
  onChange: (value: string) => void;
}

const SelectFieldRow = ({
  label,
  value,
  options,
  onChange,
}: SelectFieldRowProps) => {
  return (
    <div className="grid grid-cols-[160px_1fr] items-center py-4">
      <Label className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full max-w-88 rounded-xl border border-primary/20 cursor-pointer">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectFieldRow;
