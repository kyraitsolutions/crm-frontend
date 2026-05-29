import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { TbDotsVertical, TbPin } from "react-icons/tb";
import { Link } from "react-router-dom";

const LeadListHeader = () => {
    const StatusFilter = [
        { name: "All Leads", value: "all_leads" },
        { name: "All Locked Leads", value: "all_locked_leads" },
        { name: "Converted Leads", value: "converted_leads" },
        { name: "Junk Leads", value: "junk_leads" },
        { name: "Mailing Labels", value: "mailing_labels" },
        { name: "My Converted Leads", value: "my_converted_leads" },
        { name: "My Leads", value: "my_leads" },
        { name: "Not Qualified Leads", value: "not_qualified_leads" },
        { name: "Open Leads", value: "open_leads" },
        { name: "Recently Created Leads", value: "recently_created_leads" },
        { name: "Recently Modified Leads", value: "recently_modified_leads" },
        { name: "Today's Leads", value: "todays_leads" },
        { name: "Unread Leads", value: "unread_leads" },
        { name: "Unsubscribed Leads", value: "unsubscribed_leads" },
    ];


    const [showFilter, setShowFilter] = useState<{ name: string; value: string; pinned: boolean }[]>([{
        name: "All Leads",
        value: "all_leads",
        pinned: false,
    }]);


    const handleSelectOption = (option: { name: string; value: string }) => {
        setShowFilter((prev) => {
            if (prev.some((item) => item.value === option.value)) {
                return prev;
            }
            return [...prev, { ...option, pinned: false }];
        });
    }

    const togglePin = (option: { name: string; value: string }) => {
        setShowFilter((prev) => {
            const exists = prev.find((p) => p.value === option.value);
            if (!exists) {
                // add and pin
                return [{ ...option, pinned: true }, ...prev];
            }
            return prev.map((p) => p.value === option.value ? { ...p, pinned: !p.pinned } : p);
        });
    }
    return (
        <div className='px-5 py-2 border-b relative flex items-center gap-2'>

            <div>
                {showFilter
                    .slice()
                    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
                    .map((option) => (
                        <div key={option.value} className="inline-flex items-center px-2 py-1 hover:bg-primary/10 hover:text-primary gap-1">
                            <Link
                                to={``}
                                className="rounded-xl  text-sm text-gray-600 cursor-pointer flex items-center gap-2"
                            >
                                {option.name}
                            </Link>
                            <ButtonWithTitle
                                onClick={() => togglePin(option)}
                                title={option.pinned ? "Unpin" : "Pin"}
                                className={`p-1 flex items-center rounded-full text-sm ${option.pinned ? 'text-primary' : 'text-gray-300 hover:text-gray-500'}`}
                            >
                                <TbPin />
                            </ButtonWithTitle>
                        </div>
                    ))}
            </div>

            {(
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="flex items-center gap-2
                                rounded-[99px]
                                py-2
                                text-sm font-medium
                                text-[#37322F]
                                shadow-none
                                transition
                                "
                        >
                            {/* {label || allLabel} */}
                            <TbDotsVertical className="rotate-90" />

                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="start"
                        className="
                                rounded-xl
                                border-none
                                bg-white
                                shadow-lg
                                w-64
                                px-0!
                                h-75
                                "
                    >
                        {/* <DropdownMenuItem
                                onClick={() => console.log("")}
                                className="rounded-md text-sm cursor-pointer"
                            >
                                {""}
                            </DropdownMenuItem> */}

                        {StatusFilter.map((option) => {
                            const isSelected = showFilter.some((item) => item.value === option.value);
                            return (
                                <div key={option.value} className="flex flex-col text-start">
                                    <button
                                        onClick={() => !isSelected && handleSelectOption(option)}
                                        disabled={isSelected}
                                        className={`rounded-md px-5 py-2 text-sm text-start flex items-center justify-between ${isSelected ? "text-gray-400 cursor-not-allowed" : "hover:bg-primary/10 hover:text-primary text-gray-600 cursor-pointer"}`}
                                    >
                                        <span>{option.name}</span>

                                    </button>
                                </div>
                            )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

        </div>
    )
}

export default LeadListHeader