import { formatDateTime } from "@/utils/date-utils";
import { Filter, Funnel, Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useContactStore } from "./Contact/store/contact.store";
import { useAuthStore } from "@/stores";
import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";
import ContactPopup from "./Contact/components/ContactPopup";
import { Pagination } from "@/components/pagination";
import ContactFilter from "./Contact/components/ContactFilter";
import DataLoader from "@/components/Loader/data-loader";
import useDebounce from "@/hooks/useDebounce";


const Contacts = () => {
    const {
        loadingContacts,
        contactQuery,
        setContactQuery,
        contacts,
        fetchContacts,
        setOpen,
        currentPage,
        totalPages,
        setCurrentPage
    } = useContactStore((state) => state);
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
    const { accountId } = useAuthStore((state) => state);
    const [openFilter, setOpenFilter] = useState(false);


    const debouncedSearchQuery = useDebounce(contactQuery.search, 1000);



    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchContacts(String(accountId || ""))
    }, [accountId, currentPage, JSON.stringify({ ...contactQuery, search: "" }), debouncedSearchQuery])


    const statusColor = {
        subscribed: "bg-green-100 text-green-700",
        unsubscribed: "bg-gray-100 text-gray-600",
        bounced: "bg-red-100 text-red-700",
    } as const;

    const handleSelectedContact = (id: string) => {
        setSelectedContacts((prev) =>
            prev.includes(id) ? prev.filter((contactId) =>
                contactId !== id)
                : [...prev, id,]
        );
    };
    return (
        <div className="px-6 py-2 ">

            <div className="flex justify-between gap-2 items-center my-5">
                <div className="flex items-center gap-3 w-full">

                    {/* <h2 className="text-xl font-semibold">Contacts</h2> */}
                    <div className="flex gap-2 items-center w-full">
                        {/* Search */}
                        <div className="relative w-full max-w-sm">
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                value={contactQuery.search}
                                onChange={(e) => setContactQuery({ search: e.target.value, })}
                                className="w-full bg-gray-100 rounded-xl! px-4 border-gray-300 py-2.5 pr-8 text-sm text-[#37322F] placeholder:text-[#847971] focus:outline-none focus:border-gray-300 transition"
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
                </div>

                <div className="flex whitespace-normal items-center justify-end gap-2 w-full">
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
                </div>

            </div>


            {!loadingContacts ? <div className="border rounded-xl! overflow-">
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
                            <tr key={contact._id} className="even:bg-muted capitalize">
                                <td className="p-3">
                                    <input type="checkbox"
                                        checked={selectedContacts.includes(
                                            contact._id
                                        )}
                                        onChange={() =>
                                            handleSelectedContact(
                                                contact._id
                                            )
                                        }
                                    />
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
            </div> :
                <DataLoader />}
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