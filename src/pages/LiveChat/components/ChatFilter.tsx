import { Filter } from 'lucide-react'
import React, { useState } from 'react'
import { MdAdd } from 'react-icons/md'

const ChatFilter = () => {
    const [activeFilter, setActiveFilter] = useState("all");
    const [filterOpen, setFilterOpen] = useState(false);
    const [appliedFilter, setAppliedFilter] = useState<string[]>([]);

    const filters = [
        { label: "All", value: "all" },
        { label: "Chatbot", value: "chatbot" },
        { label: "WhatsApp", value: "whatsapp" },
        { label: "Instagram", value: "instagram" },
    ]


    const chatFilter = [
        {
            name: "Ads",
            items: ["meta", "google", "whatspp", "instagram", "telegram"]
        },
        {
            name: "tags",
            items: ["hot", "cold", "ward"]
        },
        {
            name: "status",
            items: ["read", "unread", "priority", "follow up", "sfkjf"]
        }
    ]



    const handleAddFilter = (filter: string) => {
        setAppliedFilter(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter) // remove
                : [...prev, filter] // add
        );
    };

    console.log("Applied filter", appliedFilter)
    return (
        <div className="flex flex-col gap-2 py-2 mt-1 relative">
            <div className='flex items-center justify-between px-3'>
                <h1 className='text-lg font-semibold'>Chats</h1>
                <button className="flex items-center gap-1 text-sm cursor-pointer font-medium text-white bg-second rounded-xl py-1 px-2 hover:bg-second/90">
                    <MdAdd size={24} className='text-white' />
                </button>
            </div>
            <div className="px-3 flex items-center gap-2">
                <input type="text" placeholder='Filter conversations' className="bg-gray-100 text-sm rounded-xl w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" />
                <button onClick={() => setFilterOpen(!filterOpen)} className='cursor-pointer bg-gray-100 py-2 px-2.5 rounded text-gray-500'><Filter size={20} /></button>
            </div>
            <div className="flex item-center border-b border-t border-gray-100 overflow-scroll gap-2 px-3 py-2">
                {filters.map(filter => (
                    <button
                        key={filter.value}
                        onClick={() => setActiveFilter(filter.value)}
                        className={`rounded-full cursor-pointer text-sm py-1.5 px-2.5 ${activeFilter === filter.value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {filterOpen && (
                <div className="absolute top-25 right-0 flex flex-col gap-3 shadow-lg p-4 bg-linear-to-b from-green-50 to-orange-50 z-50 w-78 rounded-xl">

                    <div className="flex justify-between items-center">
                        <h2 className="font-medium">Filters</h2>
                        {appliedFilter.length > 0 && <button
                            onClick={() => setAppliedFilter([])}
                            className="text-sm text-second"
                        >
                            Clear all
                        </button>}
                    </div>

                    {chatFilter.map((item) => (
                        <div key={item.name}>
                            <h1 className="text-gray-500 capitalize">{item.name}</h1>

                            <div className="flex gap-2 px-3 mt-1 flex-wrap">
                                {item.items.map((i) => (
                                    <div key={i}>
                                        <h1
                                            onClick={() => handleAddFilter(i)}
                                            className={`
                                                    text-xs py-1 px-3 border rounded-full capitalize cursor-pointer transition
                                                    ${appliedFilter.includes(i)
                                                    ? "bg-second text-white border-second"
                                                    : "bg-white hover:bg-gray-100"}
                                                `}
                                        >
                                            {i}
                                        </h1>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {appliedFilter.length > 0 && <button

                        className="text-sm cursor-pointer bg-second/5 border-second border rounded flex self-end w-fit px-3 text-second"
                    >
                        Apply
                    </button>}
                </div>
            )}



        </div>
    )
}

export default ChatFilter