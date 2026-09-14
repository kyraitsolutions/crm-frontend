import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TIMEZONE_OPTIONS } from "../../utils/defaultSchedule";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const TimezoneSelect = ({ value, onChange }: Props) => {
  const options = TIMEZONE_OPTIONS.some((item) => item.value === value)
    ? TIMEZONE_OPTIONS
    : [{ value, label: value }, ...TIMEZONE_OPTIONS];

  return (
    <div className="w-full flex items-center gap-6">
      <label className="text-sm">Timezone</label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full rounded-xl shadow-none max-w-lg">
          <SelectValue />
        </SelectTrigger>

        <SelectContent className="shadow-none rounded-xl">
          {options.map((option) => (
            <SelectItem
              className="rounded-xl"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimezoneSelect;
