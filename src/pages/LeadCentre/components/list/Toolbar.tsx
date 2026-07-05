import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, ChevronDown, Funnel, List, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";
import SearchInput from "@/components/ui/SearchInput";

import { LEADS_ROUTES } from "@/constants/routes/leads.path";
import { useLeadsStore } from "../../store/lead.store";

import LeadFilter from "./LeadFilter";
import Sort from "./Sort";
import useDebounce from "@/hooks/useDebounce";

const viewOptions = [
  {
    id: "list",
    title: "List view",
    icon: List,
  },
];

const Toolbar = () => {
  const navigate = useNavigate();
  const setLeadQuery = useLeadsStore((state) => state.setLeadQuery);

  const [searchText, setSearchText] = useState("");
  const [openSort, setOpenSort] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const debounceSearchText = useDebounce(searchText, 500);

  useEffect(() => {
    setLeadQuery({ search: debounceSearchText });
  }, [debounceSearchText]);

  return (
    <div className="relative flex items-center justify-between gap-4 border-b bg-white px-4 py-2 text-gray-700">
      <div className="flex flex-1 items-center gap-3">
        {/* Filter */}
        <div className="relative">
          <ButtonWithTitle
            onClick={() => setOpenFilter((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl px-3 py-1.5 transition hover:bg-gray-100"
          >
            <Funnel size={16} />
            <span className="text-sm font-medium">Filter</span>
          </ButtonWithTitle>

          <LeadFilter open={openFilter} onClose={() => setOpenFilter(false)} />
        </div>

        {/* Sort */}
        <div className="relative">
          <ButtonWithTitle
            onClick={() => setOpenSort((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl px-3 py-1.5 transition hover:bg-gray-100 hover:text-black"
          >
            <ArrowUpDown size={16} />
            <span className="text-sm font-medium">Sort</span>
          </ButtonWithTitle>

          <Sort open={openSort} onClose={() => setOpenSort(false)} />
        </div>

        {/* Views */}
        <div className="flex items-center gap-4 text-gray-500">
          {viewOptions.map(({ id, title, icon: Icon }) => (
            <ButtonWithTitle
              key={id}
              title={title}
              className="flex items-center hover:text-blue-600"
            >
              <Icon size={18} />
            </ButtonWithTitle>
          ))}
        </div>

        {/* Search */}
        <div className="w-full max-w-md">
          <SearchInput
            placeholder="Search leads"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <div className="relative flex rounded-xl shadow-sm">
          <Button
            onClick={() => navigate(LEADS_ROUTES.CREATE)}
            className="actions-btn rounded-none rounded-l-xl px-2 py-1.5 hover:bg-primary hover:text-white"
          >
            <Plus size={18} />
            Create Lead
          </Button>

          <Button
            onClick={() => setOpenDropdown((prev) => !prev)}
            className="actions-btn rounded-none rounded-r-xl bg-primary px-3 text-white"
          >
            <ChevronDown size={16} />
          </Button>

          {openDropdown && (
            <div className="absolute left-0 top-10 z-50 w-fit rounded-xl border bg-white p-2 shadow-lg">
              <button
                onClick={() => {
                  navigate(LEADS_ROUTES.IMPORT);
                  setOpenDropdown(false);
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                Import Lead
              </button>

              <button className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100">
                Import Notes
              </button>

              <button className="w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100">
                Sync Facebook Ads
              </button>

              <button className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100">
                Sync LinkedIn Ads
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;

// import { Button } from "@/components/ui/button";
// import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";
// import { LEADS_ROUTES } from "@/constants/routes/leads.path";
// import { useAuthStore } from "@/stores";
// import {
//   ArrowUpDown,
//   ChevronDown,
//   Funnel,
//   List,
//   // RotateCw,
//   // Ellipsis,
//   Plus,
// } from "lucide-react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useLeadsStore } from "../../store/lead.store";
// import LeadFilter from "./LeadFilter";
// import Sort from "./Sort";
// // import { Input } from "@/components/ui/input";
// import SearchInput from "@/components/ui/SearchInput";

// const Toolbar = () => {
//   const navigate = useNavigate();
//   const { openSort, setLeadQuery, leadQuery, setOpenSort, fetchLeads } =
//     useLeadsStore((state) => state);

//   // const debouncedSearchQuery = useDebounce(leadQuery.search, 1000);

//   const [openFilter, setOpenFilter] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState(false);

//   const viewOptions = [
//     { title: "List view", icon: List },
//     // { title: "Kanban view", icon: Columns2 },
//     // { title: "Grid view", icon: LayoutGrid },
//     // { title: "Chart view", icon: PieChart },
//     // { title: "Timeline view", icon: SquareStack },
//     // { title: "Split view", icon: Minus },
//     // { title: "Map view", icon: MapPin },
//     // { title: "More views", icon: ChevronDown },
//   ];

//   return (
//     <div className="relative flex items-center justify-between gap-4 border-b px-4 py-2 bg-white text-gray-700">
//       <div className="flex flex-1 items-center gap-3">
//         {/* Filter */}
//         <div className="relative">
//           <ButtonWithTitle
//             onClick={() => setOpenFilter(!openFilter)}
//             className="flex items-center gap-2 rounded-xl px-3 py-1.5 hover:bg-gray-100 transition"
//           >
//             <Funnel size={16} />
//             <span className="text-sm font-medium">Filter</span>
//           </ButtonWithTitle>
//           {openFilter && (
//             <LeadFilter openFilter={openFilter} setOpenFilter={setOpenFilter} />
//           )}
//         </div>

//         {/* Sort */}
//         <div className="relative">
//           <ButtonWithTitle
//             onClick={() => setOpenSort(!openSort)}
//             className="flex items-center gap-2 rounded-xl px-3 py-1.5 hover:text-black hover:bg-gray-100 transition"
//           >
//             <ArrowUpDown size={16} />
//             <span className="text-sm font-medium">Sort</span>
//           </ButtonWithTitle>
//           {openSort && <Sort />}
//         </div>

//         {/* View Icons */}
//         <div className="flex items-center gap-4 text-gray-500">
//           {viewOptions.map((item, index) => {
//             const Icon = item.icon;

//             return (
//               <ButtonWithTitle
//                 key={index}
//                 title={item.title}
//                 className="hover:text-blue-600 flex items-center"
//               >
//                 <Icon size={18} />
//               </ButtonWithTitle>
//             );
//           })}
//         </div>

//         {/* Search  */}
//         <div className="max-w-100 w-full">
//           <SearchInput
//             placeholder="Search leads"
//             onChange={(e) => setLeadQuery({ search: e.target.value })}
//           />
//         </div>

//         {/* Refresh */}
//         {/* <ButtonWithTitle
//           onClick={() => fetchLeads(String(accountId))}
//           className={`hover:text-black transition flex items-center ${loadingLeads && "animate-spin"}`}
//         >
//           <RotateCw size={18} />
//         </ButtonWithTitle> */}
//       </div>

//       <div className="flex gap-4 items-center">
//         <div className="relative flex rounded-xl! shadow-sm">
//           <Button
//             onClick={() => navigate(`${LEADS_ROUTES.CREATE}`)}
//             className="actions-btn px-2! py-1.5! rounded-none! rounded-l-xl!  hover:bg-primary! duration-500 hover:text-white!"
//           >
//             <Plus /> Create Lead
//           </Button>

//           <Button
//             onClick={() => setOpenDropdown((prev) => !prev)}
//             className="actions-btn bg-primary! rounded-none! rounded-r-xl! text-white! px-3 transition"
//           >
//             <ChevronDown size={16} />
//           </Button>

//           {openDropdown && (
//             <div className="absolute inset-0 top-9.5 rounded-xl! left-0 bg-white z-50 w-fit">
//               <div
//                 onClick={() => navigate(`${LEADS_ROUTES.IMPORT}`)}
//                 className="bg-white w-full p-2 rounded-xl border"
//               >
//                 <button className="text-sm text-start px-3 py-1.5 hover:bg-gray-100 w-full rounded-xl">
//                   Import Lead
//                 </button>
//                 <button className="text-sm  text-start px-3 py-1.5 hover:bg-gray-100 w-full rounded-xl">
//                   Import Notes
//                 </button>
//                 <button className="text-sm  text-start px-3 py-1.5 hover:bg-gray-100 w-full whitespace-nowrap rounded-xl">
//                   Sync Facebook Ads
//                 </button>
//                 <button className="text-sm  text-start px-3 py-1.5 hover:bg-gray-100 w-full rounded-xl">
//                   Sync Linkedin Ads
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* More Menu */}
//         {/* <ButtonWithTitle
//           title="Actions"
//           className="h-9 w-13 border rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
//         >
//           <Ellipsis size={20} />
//         </ButtonWithTitle> */}
//       </div>
//     </div>
//   );
// };

// export default Toolbar;
