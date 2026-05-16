import { PillFilterDropdown } from "@/components/common/FilterDropdown";
import type { Option } from "@/components/filter-dropdown";
import { dateOptions, formOptions, labelOptions, sourceOptions, stageOptions, statusOptions } from "@/constants";
import { formatDateTime } from "@/utils/date-utils";
import { Filter, Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useContactStore } from "./Contact/store/contact.store";
import { useAuthStore } from "@/stores";
import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";
import ContactPopup from "./Contact/components/ContactPopup";
import { Pagination } from "@/components/pagination";


const Contacts = () => {
    const {
        contacts,
        fetchContacts,
        setOpen,
        currentPage,
        totalPages,
        totalItems,
        setCurrentPage
    } = useContactStore((state) => state);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const { accountId } = useAuthStore((state) => state);

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
    useEffect(() => {
        fetchContacts(accountId || "")
    }, [accountId, currentPage])

    const statusColor = {
        subscribed: "bg-green-100 text-green-700",
        unsubscribed: "bg-gray-100 text-gray-600",
        bounced: "bg-red-100 text-red-700",
    } as const;
    return (
        <div className="px-6 py-2 ">

            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Contacts</h2>

                <div className="flex whitespace-normal items-center gap-2">
                    <ButtonWithTitle
                        disabled={true}
                        title={selectedContacts.length < 1 ? "Select atleast one contact" : ""}
                        className={`${selectedContacts.length < 1 ? "border border-gray-300 bg-gray-300 text-gray-500" : "border border-primary bg-primary hover:bg-primary/90 text-white"}  text-sm px-3 py-1.5 rounded font-medium transition`}>
                        BROADCAST
                    </ButtonWithTitle>
                    <ButtonWithTitle
                        title="Add Single Contact"
                        onClick={() => setOpen(true)}
                        className="border flex  items-center  gap-2 border-primary hover:bg-primary/10 text-primary text-sm px-3 py-1.5 rounded font-medium transition">
                        <Plus size={16} /> Add Contact
                    </ButtonWithTitle>
                    <ButtonWithTitle
                        title="Import contact using sheet"
                        className="border border-primary hover:bg-primary/10 text-primary text-sm px-3 py-1.5 rounded font-medium transition">
                        Import Contact
                    </ButtonWithTitle>


                    {/* Primary action */}
                    {/* <DropdownMenu>
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
                            <DropdownMenuItem className="py-1 cursor-pointer">Add single</DropdownMenuItem>
                            <DropdownMenuItem className="py-1 cursor-pointer">Import subscriber</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> */}
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

            <div className="border rounded-xl! overflow-">
                <table className="w-full text-sm ">
                    <thead className="bg-muted text-muted-foreground">
                        <tr className="text-primary">
                            <th className="p-3 text-left">
                                <input type="checkbox" />
                            </th>
                            <th className="p-3 text-left font-medium">Name</th>
                            <th className="p-3 text-left font-medium">Phone</th>
                            <th className="p-3 text-left font-medium">Email</th>
                            <th className="p-3 text-left font-medium">Status</th>
                            <th className="p-3 text-left font-medium">Tags</th>
                            <th className="p-3 text-left font-medium">Source</th>
                            <th className="p-3 text-left font-medium">Last Activity</th>
                            {/* <th className="p-3  flex justify-center font-medium">Actions</th> */}
                        </tr>
                    </thead>

                    <tbody>
                        {contacts?.map((contact) => (
                            <tr key={contact.id} className="even:bg-muted capitalize">
                                <td className="p-3">
                                    <input type="checkbox" />
                                </td>
                                <td className="p-3 font-medium capitalize">{contact.name}</td>
                                <td className="p-3 font-medium capitalize whitespace-nowrap">{contact.phone}</td>
                                <td className="p-3 lowercase">{contact.email}</td>
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[contact.status as keyof typeof statusColor]}`}
                                    >
                                        {contact.status}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <div className="flex gap-1 flex-wrap">
                                        {contact.tags?.map((tag: any) => (
                                            <span
                                                key={tag}
                                                className="bg-muted px-2 py-0.5 rounded text-xs"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-3">{contact.source}</td>
                                <td className="p-3 text-muted-foreground whitespace-nowrap">
                                    {formatDateTime(String(contact.lastActivity))}
                                </td>
                                {/* <td className="p-3 text-right flex justify-center">
                                    <button
                                        className="rounded-xl border border-[#16A34A]/30 bg-[#16A34A]/5 p-1 text-sm font-medium text-red-400
                                            transition-all
                                            hover:bg-[#16A34A]/10
                                            hover:border-[#16A34A]/50 cursor-pointer"
                                    // onClick={() => handleDeleteForm(row.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={(page) => {
                    setCurrentPage(page);
                }}
            />



            <ContactPopup />
        </div>
    )
}

export default Contacts