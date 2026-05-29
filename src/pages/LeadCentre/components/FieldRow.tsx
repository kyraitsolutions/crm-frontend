import { Phone } from "lucide-react";

export const FieldRow = ({
    label,
    value,
    isPhone,
}: {
    label: string;
    value: string;
    isPhone?: boolean;
}) => {
    return (
        <div className="grid grid-cols-[160px_1fr] items-center py-3">
            <span className="text-[#5b6b82] text-sm">{label}</span>

            <div className="flex items-center gap-2 text-sm text-[#1f2937]">
                <span>{value}</span>

                {isPhone && (
                    <button className="bg-[#dcfce7] p-1.5 rounded-md hover:bg-[#bbf7d0] transition">
                        <Phone size={14} className="text-green-600" />
                    </button>
                )}
            </div>
        </div>
    );
};