import { sourceOptions, stageOptions, statusOptions } from "@/constants";
import Filter from "@/components/Filter/Filter";
import { useLeadsStore } from "../../store/lead.store";

interface LeadFilterProps {
  open: boolean;
  onClose: () => void;
}

// type LeadFilters = {
//   source: string;
//   status: string;
//   stage: string;
//   search: string;
//   read: boolean | null;
//   dateRange: {
//     startDate: string;
//     endDate: string;
//   };
// };

const ENABLE_FILTERS = {
  stage: true,
  read: true,
};

const DEFAULT_FILTERS = {
  source: "",
  status: "",
  stage: "",
  search: "",
  read: null,
  dateRange: {
    startDate: "",
    endDate: "",
  },
};

const LeadFilter = ({ open, onClose }: LeadFilterProps) => {
  const leadQuery = useLeadsStore((state) => state.leadQuery);
  const setLeadQuery = useLeadsStore((state) => state.setLeadQuery);

  if (!open) return null;

  const initialFilters = {
    source: leadQuery.source ?? "",
    status: leadQuery.status ?? "",
    stage: "",
    read: null,
    startDate: leadQuery.dateRange?.startDate ?? null,
    endDate: leadQuery.dateRange?.endDate ?? null,
  };

  const handleApply = (filters: any) => {
    setLeadQuery(filters);
    onClose();
  };

  const handleReset = () => {
    setLeadQuery(DEFAULT_FILTERS);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50">
      <Filter
        enable={ENABLE_FILTERS}
        openFilter={open}
        setOpenFilter={(value) => {
          if (!value) {
            onClose();
          }
        }}
        initialFilters={initialFilters}
        onApply={handleApply}
        onReset={handleReset}
        statusOptions={statusOptions}
        sourceOptions={sourceOptions}
        stageOptions={stageOptions}
      />
    </div>
  );
};

export default LeadFilter;

// import { useLeadsStore } from "../../store/lead.store";
// import { useState } from "react";
// import Filter from "@/components/Filter/Filter";
// import { sourceOptions, stageOptions, statusOptions } from "@/constants";

// const LeadFilter = ({
//   openFilter,
//   setOpenFilter,
// }: {
//   openFilter: boolean;
//   setOpenFilter: (open: boolean) => void;
// }) => {
//   const { setLeadQuery, leadQuery } = useLeadsStore((state) => state);

//   const [enable] = useState<{ stage: boolean; read: boolean }>({
//     stage: true,
//     read: true,
//   });

//   if (!openFilter) return null;

//   return (
//     <div className="absolute inset-0 z-50 ">
//       <Filter
//         enable={enable}
//         openFilter={openFilter}
//         setOpenFilter={setOpenFilter}
//         initialFilters={{
//           source: leadQuery.source ?? "",
//           status: leadQuery.status ?? "",
//           stage: "",
//           read: null,
//           startDate: leadQuery.dateRange?.startDate ?? null,
//           endDate: leadQuery.dateRange?.endDate ?? null,
//         }}
//         onApply={(filters: any) => {
//           setLeadQuery({
//             source: filters.source,
//             search: filters.search,
//             status: filters.status,
//             stage: filters.stage,
//             read: filters.read ?? null,
//             dateRange: {
//               startDate: filters.dateRange.startDate ?? "",
//               endDate: filters.dateRange.endDate ?? "",
//             },
//           });
//         }}
//         onReset={() => {
//           setLeadQuery({
//             source: "",
//             status: "",
//             stage: "",
//             read: null,
//             dateRange: {
//               startDate: "",
//               endDate: "",
//             },
//           });
//         }}
//         statusOptions={statusOptions}
//         sourceOptions={sourceOptions}
//         stageOptions={stageOptions}
//       />
//     </div>
//   );
// };

// export default LeadFilter;
