import { useLeadsStore } from "../store/lead.store";
import { useState } from "react";
import Filter from "@/components/Filter/Filter";
import { sourceOptions, stageOptions, statusOptions } from "@/constants";


const LeadFilter = ({ openFilter, setOpenFilter }: { openFilter: boolean, setOpenFilter: (open: boolean) => void }) => {
    const { setLeadQuery, leadQuery, } = useLeadsStore((state) => state);

    const [enable,
        //  setEnable
    ] = useState<{ stage: boolean, read: boolean }>({
        stage: true,
        read: true,
    });


    if (!openFilter) return null;

    console.log("Lead query", leadQuery)
    return (
        <div className="absolute inset-0 z-50 ">
            <Filter
                enable={enable}
                openFilter={openFilter}
                setOpenFilter={setOpenFilter}
                initialFilters={{
                    source: leadQuery.source ?? "",
                    status: leadQuery.status ?? "",
                    stage: "",
                    read: null,
                    startDate: leadQuery.dateRange?.startDate ?? null,
                    endDate: leadQuery.dateRange?.endDate ?? null,
                }}
                onApply={(filters: any) => {
                    console.log("Filter inside on Apply", filters)
                    setLeadQuery({
                        source: filters.source,
                        search: filters.search,
                        status: filters.status,
                        stage: filters.stage,
                        read: filters.read ?? null,
                        dateRange: {
                            startDate: filters.dateRange.startDate ?? "",
                            endDate: filters.dateRange.endDate ?? ""
                        }
                    });
                }}
                onReset={() => {
                    setLeadQuery({
                        source: "",
                        status: "",
                        stage: "",
                        read: null,
                        dateRange: {
                            startDate: "",
                            endDate: "",
                        },
                    });
                }}
                statusOptions={statusOptions}
                sourceOptions={sourceOptions}
                stageOptions={stageOptions}
            />
        </div>
    );
};

export default LeadFilter;