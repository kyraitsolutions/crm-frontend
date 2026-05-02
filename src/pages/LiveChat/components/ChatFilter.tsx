import { Filter } from 'lucide-react'
import React, { useState } from 'react'
import { MdAdd } from 'react-icons/md'

const ChatFilter = () => {
    const [activeFilter, setActiveFilter] = useState("all");
    const [filterOpen, setFilterOpen] = useState(false);

    const filters = [
        { label: "All", value: "all" },
        { label: "Chatbot", value: "chatbot" },
        { label: "WhatsApp", value: "whatsapp" },
        { label: "Instagram", value: "instagram" },
    ]


    const chatFilter = [
        {
            name: "Ads",
            items: ["meta", "google", "whatspp"]
        },
        {
            name: "tags",
            items: ["hot", "cold", "ward"]
        },
        {
            name: "status",
            items: ["read", "unread", "priority", "follow up"]
        }
    ]
    return (
        <div className="flex flex-col gap-2 py-2 mt-1 relative">
            <div className='flex items-center justify-between px-3'>
                <h1 className='text-lg font-semibold'>Chats</h1>
                <button className="flex items-center gap-1 text-sm cursor-pointer font-medium text-white bg-primary rounded-xl py-1 px-2 hover:bg-primary/90">
                    <MdAdd size={24} className='text-white' />
                </button>
            </div>
            <div className="px-3 flex items-center gap-2">
                <input type="text" placeholder='Filter conversations' className="bg-gray-100 text-sm rounded-xl w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" />
                <button onClick={() => setFilterOpen(!filterOpen)} className='bg-gray-100 py-2 px-2.5 rounded text-gray-500'><Filter size={20} /></button>
            </div>
            <div className="flex item-center border-b border-t border-gray-100 overflow-scroll gap-2 px-3 py-2">
                {filters.map(filter => (
                    <button
                        key={filter.value}
                        onClick={() => setActiveFilter(filter.value)}
                        className={`rounded-full text-sm py-1.5 px-2.5 ${activeFilter === filter.value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {filterOpen &&
                <div className='absolute top-25 right-0 bg-red-900 z-50'>
                    {chatFilter.map((item, index) => (
                        <div key={index}>
                            <h1>{item.name}</h1>
                            <div className='flex gap-2 px-3 capitalize'>

                                {item.items.map((i, index) => (
                                    <div key={index}>
                                        <h1>{i}</h1>

                                    </div>
                                ))}
                            </div>

                        </div>
                    ))}

                </div>}



        </div>
    )
}

export default ChatFilter