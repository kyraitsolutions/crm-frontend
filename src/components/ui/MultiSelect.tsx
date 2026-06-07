import { Check } from "lucide-react";

interface MultiSelectProps {
  options: {
    key: string;
    label: string;
  }[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultiSelect({ options, value, onChange }: MultiSelectProps) {
  const isAllSelected = options.length > 0 && value.length === options.length;

  const toggleAll = () => {
    if (isAllSelected) {
      onChange([]);
      return;
    }

    onChange(options.map((option) => option.key));
  };

  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
      return;
    }

    onChange([...value, option]);
  };

  return (
    <div className="border rounded-md p-2 space-y-2">
      {options.length > 1 && (
        <button
          type="button"
          onClick={toggleAll}
          className="flex items-center gap-2 w-full text-left border-b pb-2 mb-2"
        >
          <div className="h-4 w-4 border rounded flex items-center justify-center">
            {isAllSelected && <Check className="h-3 w-3" />}
          </div>

          <span className="font-medium">All</span>
        </button>
      )}

      <div className="columns-2 space-y-2">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => toggleOption(option.key)}
            className="flex items-center gap-2 w-full text-left"
          >
            <div className="h-4 w-4 border rounded flex items-center justify-center">
              {value.includes(option.key) && <Check className="h-3 w-3" />}
            </div>

            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
