import { Clock3 } from "lucide-react";

interface Props {
    value: string;
    onClick: () => void;
}

const TimePickerInput = ({ value, onClick }: Props) => {
    return (
        <button
            onClick={onClick}
            className="flex h-10 items-center justify-between rounded-xl bg-gray-100 px-4"
        >
            <span className="text-sm">{value}</span>

            <Clock3 size={16} className="text-gray-500" />
        </button>
    );
};

export default TimePickerInput;