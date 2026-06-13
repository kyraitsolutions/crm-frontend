import { Search } from 'lucide-react';
import { useLeadsStore } from '../store/lead.store';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores';
import useDebounce from '@/hooks/useDebounce';

const Sort = () => {
    const { openSort, setOpenSort, currentPage, fetchLeads, leadQuery, setLeadQuery } = useLeadsStore((state) => state);
    const { accountId } = useAuthStore((state) => state);

    const debouncedSearchQuery = useDebounce(leadQuery.search, 1000);

    useEffect(() => {
        fetchLeads(String(accountId));
    }, [currentPage, debouncedSearchQuery, leadQuery.sortBy, leadQuery.sortOrder]);

    const sortOptions = [
        { label: "Address - Zip / Postal Code", value: "address.zip" },
        { label: "Annual Revenue", value: "annualRevenue" },
        { label: "Average Time Spent", value: "averageTimeSpent" },
        { label: "Company", value: "company" },
        { label: "Created By", value: "createdBy" },
        { label: "Created Time", value: "createdAt" },
        { label: "Days Visited", value: "daysVisited" },
    ];

    if (!openSort) return null;
    return (

        <>
            {openSort && (
                <div
                    className="absolute inset-0 z-50 "
                    onClick={() =>
                        setOpenSort(
                            false
                        )
                    }
                >

                    {/* <div onClick={(e) => e.stopPropagation()} className=" relative top-52 left-48 w-105 rounded-xl border border-primary bg-white shadow-xl p-4 -z-20"> */}
                    <div onClick={(e) => e.stopPropagation()} className=" relative mt-10 w-105 rounded-xl border border-primary bg-white shadow-xl p-4 -z-20">
                        <div >
                            <div className='h-5.5 w-5.5 bg-white border-l border-t border-primary rotate-45 -mt-7' />
                            <h3 className="text-sm font-medium mb-3">
                                Sort By
                            </h3>

                            <div className="flex gap-2 mb-3">
                                {/* Sort Field */}
                                <select
                                    value={leadQuery.sortBy}
                                    onChange={(e) =>
                                        setLeadQuery({
                                            sortBy: e.target.value,
                                        })
                                    }
                                    className="border rounded-md px-3 py-2 w-full text-sm"
                                >
                                    <option value="">
                                        None
                                    </option>

                                    {sortOptions.map((item) => (
                                        <option
                                            key={item.value}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </option>
                                    ))}
                                </select>

                                {/* Sort Direction */}
                                <select
                                    value={leadQuery.sortOrder}
                                    onChange={(e) =>
                                        setLeadQuery({
                                            sortOrder: e.target.value as 'asc' | 'desc',
                                        })
                                    }
                                    className="border rounded-md px-3 py-2 w-45 text-sm"
                                >
                                    <option value="asc">
                                        Ascending
                                    </option>

                                    <option value="desc">
                                        Descending
                                    </option>
                                </select>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search
                                    size={18}
                                    className="absolute left-3 top-3 text-gray-400"
                                />

                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={leadQuery.search}
                                    onChange={(e) => setLeadQuery({ search: e.target.value, })}
                                    className="w-full border rounded-md outline-none pl-10 pr-4 py-2 text-sm"
                                />
                            </div>

                            {/* List */}
                            {/* <div className="max-h-[250px] overflow-auto mt-3">
                {filteredOptions.map((item) => (
                    <button
                        key={item.value}
                        onClick={() =>
                            setLeadQuery({
                                ...leadQuery,
                                sortBy: item.value,
                            })
                        }
                        className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${leadQuery.sortBy === item.value
                            ? "bg-gray-100"
                            : ""
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div> */}
                        </div>

                    </div>
                </div>)}
        </>

    )
}

export default Sort