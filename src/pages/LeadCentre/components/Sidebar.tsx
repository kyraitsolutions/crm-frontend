const relatedList = [
    "overview",
    "details",
    "notes",
    // "connected Records",
    // "cadences",
    "attachments",
    // "products",
    // "open Activities",
    // "closed Activities",
    // "invited Meetings",
    "emails",
    // "campaigns",
    // "docial",
    // "visits",
];

interface SidebarProps {
    counts: Record<string, number>;
    onTabClick: (tab: string) => void;
}

const Sidebar = ({ onTabClick, counts }: SidebarProps) => {
    return (
        <aside className="w-60 h-screen bg-white border-r border-[#e5e7eb] overflow-y-auto">
            <div className="p-4">
                <h3 className="text-sm font-semibold text-[#1f2937] mb-4">
                    Related List
                </h3>

                <div className="space-y-3">
                    {relatedList.map((item) => (
                        <button
                            key={item}
                            onClick={() => onTabClick(item)}
                            className="block w-full text-left capitalize text-sm text-[#334155] hover:text-blue-600 transition"
                        >
                            {item}

                            {(counts[item] ?? 0) > 0 && (
                                <span className="bg-primary/20 px-2 py-px rounded-xl ml-2 text-primary text-xs min-w-5.5 text-center">
                                    {counts[item]}
                                </span>
                            )}
                        </button>

                    ))}
                </div>

                <button className="text-blue-600 mt-5 text-sm hover:underline">
                    Add Related List
                </button>

                <div className="mt-10">
                    <h3 className="font-semibold text-sm text-[#1f2937] mb-4">
                        Links
                    </h3>

                    <button className="text-blue-600 hover:underline text-sm">
                        Add Link
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar