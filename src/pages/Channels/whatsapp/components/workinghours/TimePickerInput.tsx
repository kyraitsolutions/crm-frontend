interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const TimePickerInput = ({ value, onChange, disabled }: Props) => {
  return (
    <input
      type="time"
      value={value || "09:00"}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="flex h-10 w-full items-center rounded-xl bg-gray-100 px-4 text-sm outline-none disabled:opacity-50"
    />
  );
};

export default TimePickerInput;
