import { useLeadsStore } from "../../store/lead.store";

const SORT_OPTIONS = [
  { label: "Address - Zip / Postal Code", value: "address.zip" },
  { label: "Annual Revenue", value: "annualRevenue" },
  { label: "Average Time Spent", value: "averageTimeSpent" },
  { label: "Company", value: "company" },
  { label: "Created By", value: "createdBy" },
  { label: "Created Time", value: "createdAt" },
  { label: "Days Visited", value: "daysVisited" },
];

const Sort = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const leadQuery = useLeadsStore((state) => state.leadQuery);
  const setLeadQuery = useLeadsStore((state) => state.setLeadQuery);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative mt-10 w-[420px] rounded-xl border border-primary/50 bg-white shadow-xl p-4"
      >
        <div className="absolute -top-2 left-6 h-4 w-4 rotate-45 border-l border-t border-primary/50 bg-white" />

        <h3 className="mb-4 text-sm font-medium">Sort By</h3>

        <div className="flex gap-3">
          <select
            value={leadQuery.sortBy}
            onChange={(e) =>
              setLeadQuery({
                sortBy: e.target.value,
              })
            }
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="">None</option>

            {SORT_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={leadQuery.sortOrder}
            onChange={(e) =>
              setLeadQuery({
                sortOrder: e.target.value as "asc" | "desc",
              })
            }
            className="w-40 rounded-md border px-3 py-2 text-sm"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Sort;

// // import { Search } from "lucide-react";
// import { useAuthStore } from "@/stores";
// import { useLeadsStore } from "../../store/lead.store";

// const Sort = () => {
//   const {
//     openSort,
//     setOpenSort,
//     currentPage,
//     fetchLeads,
//     leadQuery,
//     setLeadQuery,
//   } = useLeadsStore((state) => state);
//   const { accountId } = useAuthStore((state) => state);

//   // const debouncedSearchQuery = useDebounce(leadQuery.search, 1000);

//   // useEffect(() => {
//   //   if (openSort) return;
//   //   fetchLeads(String(accountId));
//   // }, [
//   //   currentPage,
//   //   // debouncedSearchQuery,
//   //   leadQuery.sortBy,
//   //   leadQuery.sortOrder,
//   // ]);

//   const sortOptions = [
//     { label: "Address - Zip / Postal Code", value: "address.zip" },
//     { label: "Annual Revenue", value: "annualRevenue" },
//     { label: "Average Time Spent", value: "averageTimeSpent" },
//     { label: "Company", value: "company" },
//     { label: "Created By", value: "createdBy" },
//     { label: "Created Time", value: "createdAt" },
//     { label: "Days Visited", value: "daysVisited" },
//   ];

//   if (!openSort) return null;

//   return (
//     <>
//       {openSort && (
//         <div
//           className="absolute inset-0 z-50 "
//           onClick={() => setOpenSort(false)}
//         >
//           {/* <div onClick={(e) => e.stopPropagation()} className=" relative top-52 left-48 w-105 rounded-xl border border-primary bg-white shadow-xl p-4 -z-20"> */}
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className=" relative mt-10 w-105 rounded-xl border border-primary/50 bg-white shadow-xl p-4 -z-20"
//           >
//             <div>
//               <div className="h-5.5 w-5.5 bg-white border-l border-t border-primary rotate-45 -mt-7" />
//               <h3 className="text-sm font-medium mb-3">Sort By</h3>

//               <div className="flex gap-2 mb-3">
//                 {/* Sort Field */}
//                 <select
//                   value={leadQuery.sortBy}
//                   onChange={(e) =>
//                     setLeadQuery({
//                       sortBy: e.target.value,
//                     })
//                   }
//                   className="border rounded-md px-3 py-2 w-full text-sm"
//                 >
//                   <option value="">None</option>

//                   {sortOptions.map((item) => (
//                     <option key={item.value} value={item.value}>
//                       {item.label}
//                     </option>
//                   ))}
//                 </select>

//                 {/* Sort Direction */}
//                 <select
//                   value={leadQuery.sortOrder}
//                   onChange={(e) =>
//                     setLeadQuery({
//                       sortOrder: e.target.value as "asc" | "desc",
//                     })
//                   }
//                   className="border rounded-md px-3 py-2 w-45 text-sm"
//                 >
//                   <option value="asc">Ascending</option>

//                   <option value="desc">Descending</option>
//                 </select>
//               </div>

//               {/* Search */}
//               {/* <div className="relative">
//                 <Search
//                   size={18}
//                   className="absolute left-3 top-3 text-gray-400"
//                 />

//                 <input
//                   type="text"
//                   placeholder="Search"
//                   value={leadQuery.search}
//                   onChange={(e) => setLeadQuery({ search: e.target.value })}
//                   className="w-full border rounded-md outline-none pl-10 pr-4 py-2 text-sm"
//                 />
//               </div> */}

//               {/* List */}
//               {/* <div className="max-h-[250px] overflow-auto mt-3">
//                 {filteredOptions.map((item) => (
//                     <button
//                         key={item.value}
//                         onClick={() =>
//                             setLeadQuery({
//                                 ...leadQuery,
//                                 sortBy: item.value,
//                             })
//                         }
//                         className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${leadQuery.sortBy === item.value
//                             ? "bg-gray-100"
//                             : ""
//                             }`}
//                     >
//                         {item.label}
//                     </button>
//                 ))}
//             </div> */}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Sort;
