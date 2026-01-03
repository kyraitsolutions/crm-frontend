import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface PillFilterDropdownProps {
    label: string;
    options: { label: string; value: any }[];
    allLabel: string;
    onSelect: (option: { label: string; value: any }) => void;
}

export function PillFilterDropdown({
    label,
    options,
    allLabel,
    onSelect,
}: PillFilterDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="
                        flex items-center gap-2
                        rounded-[99px]
                        px-4 py-2
                        text-sm font-medium
                        bg-[#FBFAF9]
                        text-[#37322F]
                        shadow-none
                        transition
                        "
                >
                    {label || allLabel}
                    <ChevronDown className="h-4 w-4 opacity-80" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                className="
                    mt-2
                    rounded-xl
                    border-none
                    bg-[#FBFAF9]
                    p-1
                    shadow-lg
                    "
            >
                <DropdownMenuItem
                    onClick={() => onSelect({ label: allLabel, value: null })}
                    className="rounded-md text-sm cursor-pointer"
                >
                    {allLabel}
                </DropdownMenuItem>

                {options.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => onSelect(option)}
                        className="rounded-md text-sm cursor-pointer"
                    >
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
