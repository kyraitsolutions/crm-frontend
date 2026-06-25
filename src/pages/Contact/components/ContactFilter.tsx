import Filter from "@/components/Filter/Filter"
import { useState } from "react";
import { useContactStore } from "../store/contact.store";
import { contactStatusOptions, sourceOptions } from "@/constants";

const ContactFilter = ({ openFilter, setOpenFilter }: { openFilter: boolean, setOpenFilter: (open: boolean) => void }) => {

    const {
        contactQuery,
        setContactQuery
        // contacts,
        // fetchContacts,
        // setOpen,
        // currentPage,
        // totalPages,
        // setCurrentPage
    } = useContactStore((state) => state);
    const [enable,
        // setEnable
    ] = useState<{ stage: boolean, read: boolean }>({
        stage: false,
        read: false,
    });

    console.log("Contact query", contactQuery)

    return (
        <div>
            <Filter
                enable={enable}
                openFilter={openFilter}
                setOpenFilter={setOpenFilter}
                initialFilters={{
                    source: contactQuery.source ?? "",
                    status: contactQuery.status ?? "",
                    stage: "",
                    read: undefined,
                    startDate: contactQuery.dateRange?.startDate ?? null,
                    endDate: contactQuery.dateRange?.endDate ?? null,
                }}
                onApply={(filters: any) => {
                    console.log("Filter inside on Apply", filters)
                    setContactQuery({
                        source: filters.source,
                        search: filters.search,
                        status: filters.status,
                        dateRange: {
                            startDate: filters.dateRange.startDate ?? "",
                            endDate: filters.dateRange.endDate ?? ""
                        }
                    });
                }}
                onReset={() => {
                    setContactQuery({
                        source: "",
                        status: "",
                        dateRange: {
                            startDate: "",
                            endDate: "",
                        },
                    });
                }}
                statusOptions={contactStatusOptions}
                sourceOptions={sourceOptions}
            />
        </div>
    )
}

export default ContactFilter