import { PillFilterDropdown } from "@/components/common/FilterDropdown";
import type { Option } from "@/components/filter-dropdown";
import { Button } from "@/components/ui/button";
import { dateOptions, formOptions, labelOptions, sourceOptions, stageOptions, statusOptions } from "@/constants";
import { EmailService } from "@/services/email.service";
import { formatDate } from "@/utils/date-utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Filter, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Contacts = () => {
    const { accountId } = useParams();
    const emailService = new EmailService();

    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [showFilters, setShowFilters] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Record<string, Option>>({
        lead: { label: "All Leads", value: null },
        campaign: { label: "All Campaigns", value: null },
        form: { label: "All Forms", value: null },
        date: { label: "All Dates", value: null },
        status: { label: "All Status", value: null },
        source: { label: "All Sources", value: null },
        assignedTo: { label: "All Users", value: null },
        label: { label: "All Labels", value: null },
        stage: { label: "All Stages", value: null },
        read: { label: "All", value: null },
    });

    const fetchSubscribers = async () => {
        try {
            const response = await emailService.getSubscribers(String(accountId))
            setSubscribers(response.data?.data);

        } catch (error) {
            console.log("Error fetching subscribers");
        }
    }

    useEffect(() => {
        fetchSubscribers()
    }, [])

    const statusColor = {
        subscribed: "bg-green-100 text-green-700",
        unsubscribed: "bg-gray-100 text-gray-600",
        bounced: "bg-red-100 text-red-700",
    } as const;
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Contacts</h2>

                <div className="flex whitespace-normal items-center gap-6">
                    {/* Primary action */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className=""
                            >
                                <Plus className="h-4 w-4" />
                                Add Subscriber
                                <ChevronDown className="h-4 w-4 opacity-70" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-lg shadow-sm px-3 bg-white mt-2 text-sm py-2">
                            <DropdownMenuItem className="py-1 cursor-pointer">Add single subscriber</DropdownMenuItem>
                            <DropdownMenuItem className="py-1 cursor-pointer">Import subscriber</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>

            <div className="">
                <div className="mb-6 flex items-center justify-between gap-6">
                    {/* Search */}
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            //   value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                // setCurrentPage(1);
                            }}
                            className="
                                w-full
                                bg-transparent
                                border-b
                                border-[rgba(50,45,43,0.20)]
                                py-2 pr-8
                                text-sm
                                text-[#37322F]
                                placeholder:text-[#847971]
                                focus:outline-none
                                focus:border-[#37322F]
                                transition
                            "
                        />

                        {/* Right icon */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                            {searchQuery ? (
                                <button
                                    onClick={() => {
                                        // setSearchQuery("");
                                        // setCurrentPage(1);
                                    }}
                                    className="text-[#847971] hover:text-[#37322F] transition"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            ) : (
                                <Search className="h-4 w-4 text-[#847971]" />
                            )}
                        </div>
                    </div>

                    {/* Filters toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="
                        flex items-center gap-2
                        whitespace-nowrap
                        text-sm font-medium
                        text-[#37322F]
                        hover:text-[#1f1c1a]
                        transition
                        "
                    >
                        <Filter className="h-4 w-4 text-[#847971]" />
                        {showFilters ? "Hide filters" : "Show filters"}
                    </button>
                </div>

                {showFilters && (
                    <div className="mb-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <PillFilterDropdown
                                label={filters.form.label}
                                options={formOptions}
                                allLabel="All Forms"
                                onSelect={(value) =>
                                    setFilters((prev) => ({ ...prev, form: value }))
                                }
                            />

                            <PillFilterDropdown
                                label={filters.date.label}
                                options={dateOptions}
                                allLabel="All Dates"
                                onSelect={(value) =>
                                    setFilters((prev) => ({ ...prev, date: value }))
                                }
                            />

                            <PillFilterDropdown
                                label={filters.status.label}
                                options={statusOptions}
                                allLabel="All Status"
                                onSelect={(value) =>
                                    setFilters((prev) => ({ ...prev, status: value }))
                                }
                            />

                            <PillFilterDropdown
                                label={filters.source.label}
                                options={sourceOptions}
                                allLabel="All Sources"
                                onSelect={(value) =>
                                    setFilters((prev) => ({ ...prev, source: value }))
                                }
                            />

                            <PillFilterDropdown
                                label={filters.stage.label}
                                options={stageOptions}
                                allLabel="All Stages"
                                onSelect={(value) =>
                                    setFilters((prev) => ({ ...prev, stage: value }))
                                }
                            />

                            <PillFilterDropdown
                                label={filters.label.label}
                                options={labelOptions}
                                allLabel="All Labels"
                                onSelect={(value) =>
                                    setFilters((prev) => ({ ...prev, label: value }))
                                }
                            />

                            {/* Clear filters */}
                            {(filters.form.value ||
                                filters.date.value ||
                                filters.status.value ||
                                filters.source.value ||
                                filters.assignedTo.value ||
                                filters.stage.value ||
                                filters.label.value) && (
                                    <button
                                        onClick={() =>
                                            setFilters({
                                                lead: { label: "All Leads", value: null },
                                                campaign: { label: "All Campaigns", value: null },
                                                form: { label: "All Forms", value: null },
                                                date: { label: "All Dates", value: null },
                                                status: { label: "All Status", value: null },
                                                source: { label: "All Sources", value: null },
                                                assignedTo: { label: "All Users", value: null },
                                                label: { label: "All Labels", value: null },
                                                stage: { label: "All Stages", value: null },
                                                read: { label: "All", value: null },
                                            })
                                        }
                                        className="
            flex items-center gap-1
            text-sm font-medium
            text-[#847971]
            hover:text-[#37322F]
            transition
          "
                                    >
                                        <X className="h-4 w-4" />
                                        Clear
                                    </button>
                                )}
                        </div>
                    </div>
                )}


            </div>

            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted text-muted-foreground">
                        <tr>
                            <th className="p-3 text-left">
                                <input type="checkbox" />
                            </th>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Tags</th>
                            <th className="p-3 text-left">Source</th>
                            <th className="p-3 text-left">Last Activity</th>
                            <th className="p-3  flex justify-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {subscribers?.map((sub) => (
                            <tr key={sub._id} className="border-t capitalize">
                                <td className="p-3">
                                    <input type="checkbox" />
                                </td>
                                <td className="p-3 font-medium capitalize">{sub.name}</td>
                                <td className="p-3">{sub.email}</td>
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[sub.status as keyof typeof statusColor]}`}
                                    >
                                        {sub.status}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <div className="flex gap-1 flex-wrap">
                                        {sub.tags?.map((tag: any) => (
                                            <span
                                                key={tag}
                                                className="bg-muted px-2 py-0.5 rounded text-xs"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-3">{sub.source}</td>
                                <td className="p-3 text-muted-foreground">
                                    {formatDate(sub.lastActivity)}
                                </td>
                                <td className="p-3 text-right flex justify-center">
                                    <button
                                        className="rounded-xl border border-[#16A34A]/30 bg-[#16A34A]/5 p-1 text-sm font-medium text-red-400
                                            transition-all
                                            hover:bg-[#16A34A]/10
                                            hover:border-[#16A34A]/50 cursor-pointer"
                                    // onClick={() => handleDeleteForm(row.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Contacts