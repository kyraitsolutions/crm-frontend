import { Button } from '@/components/ui/button';
import ButtonWithTitle from '@/components/ui/Buttons/ButtonWithTitle';
import ContactFilter from '@/pages/Contact/components/ContactFilter';
import { Funnel, RefreshCw, Search, X } from 'lucide-react';
import React, { useState } from 'react'

const CallFilter = () => {
    const [openFilter, setOpenFilter] = useState(false);
    //     const debouncedSearchQuery = useDebounce(contactQuery.search, 1000);



    const [searchQuery, setSearchQuery] = useState("");

    //   useEffect(() => {
    //     fetchContacts(String(accountId || ""))
    //   }, [accountId, currentPage, JSON.stringify({ ...contactQuery, search: "" }), debouncedSearchQuery])
    return (
        <div className="flex gap-2 items-center justify-between w-full">
            {/* Search */}
            <div className='flex gap-2 items-center justify-center'>

                <div className="relative w-full min-w-md">
                    <input
                        type="text"
                        placeholder="Search name, phone, email"
                        value={""}
                        // onChange={(e) => setContactQuery({ search: e.target.value, })}
                        className="w-full bg-gray-100 rounded-xl! px-4 border-gray-300 py-2 pr-8 text-sm text-[#37322F] placeholder:text-[#847971] focus:outline-none focus:border-gray-300 transition"
                    />

                    {/* Right icon */}
                    <div className="absolute right-3  top-1/2 -translate-y-1/2">
                        {searchQuery ? (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    // setCurrentPage(1);
                                }}
                                className="text-[#847971] mt-1 hover:text-[#37322F] transition"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        ) : (
                            <Search className="h-4 w-4 text-[#847971]" />
                        )}
                    </div>
                </div>
                <div className="relative">
                    <ButtonWithTitle onClick={() => setOpenFilter(!openFilter)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 hover:bg-gray-100 transition">
                        <Funnel size={16} />
                        <span className="text-sm font-medium">Filter</span>
                    </ButtonWithTitle>
                    {openFilter && <ContactFilter openFilter={openFilter} setOpenFilter={setOpenFilter} />}

                </div>



            </div>
            <div>
                <Button className='border border-primary text-primary bg-primary/20 rounded-xl hover:text-white duration-200 transition-all'>
                    <RefreshCw /> Refresh
                </Button>
            </div>

        </div>
    )
}

export default CallFilter