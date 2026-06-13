import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";
import { LEADS_ROUTES } from "@/constants/routes/leads.path";
import {
    Funnel,
    ArrowUpDown,
    List,
    ChevronDown,
    RotateCw,
    Ellipsis,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLeadsStore } from "../store/lead.store";
import { useAuthStore } from "@/stores";
import Sort from "./Sort";
import LeadFilter from "./LeadFilter";

const Toolbar = () => {
    const navigate = useNavigate();
    const { accountId } = useAuthStore((state) => state)
    const { openSort, loadingLeads, setOpenSort, fetchLeads } = useLeadsStore((state) => state);
    const [openFilter, setOpenFilter] = useState(false);

    const viewOptions = [
        { title: "List view", icon: List },
        // { title: "Kanban view", icon: Columns2 },
        // { title: "Grid view", icon: LayoutGrid },
        // { title: "Chart view", icon: PieChart },
        // { title: "Timeline view", icon: SquareStack },
        // { title: "Split view", icon: Minus },
        // { title: "Map view", icon: MapPin },
        // { title: "More views", icon: ChevronDown },
    ];


    return (
        <div className="relative flex items-center justify-between gap-4 border-b px-4 py-2 bg-white text-gray-700">
            <div className="flex items-center gap-3">

                {/* Filter */}
                <div className="relative">
                    <ButtonWithTitle onClick={() => setOpenFilter(!openFilter)} className="flex items-center gap-2 rounded-xl px-3 py-1.5 hover:bg-gray-100 transition">
                        <Funnel size={16} />
                        <span className="text-sm font-medium">Filter</span>
                    </ButtonWithTitle>
                    {openFilter && <LeadFilter openFilter={openFilter} setOpenFilter={setOpenFilter} />}
                </div>

                {/* Sort */}
                <div className="relative">

                    <ButtonWithTitle onClick={() => setOpenSort(!openSort)} className="flex items-center gap-2 rounded-xl px-3 py-1.5 hover:text-black hover:bg-gray-100 transition">
                        <ArrowUpDown size={16} />
                        <span className="text-sm font-medium">Sort</span>
                    </ButtonWithTitle>
                    {openSort && <Sort />}

                </div>

                <div className="h-5 w-px bg-gray-300" />

                {/* View Icons */}
                <div className="flex items-center gap-4 text-gray-500">
                    {viewOptions.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <ButtonWithTitle
                                key={index}
                                title={item.title}
                                className="hover:text-blue-600 flex items-center"
                            >
                                <Icon size={18} />
                            </ButtonWithTitle>
                        );
                    })}
                </div>
                <div className="h-5 w-px bg-gray-300" />

                {/* Refresh */}
                <ButtonWithTitle onClick={() => fetchLeads(String(accountId))} className={`hover:text-black transition flex items-center ${loadingLeads && "animate-spin"}`}>
                    <RotateCw size={18} />
                </ButtonWithTitle>
            </div>

            <div className="flex gap-4 items-center">
                <div className="flex overflow-hidden rounded-xl shadow-sm">
                    <button
                        onClick={() => navigate(`${LEADS_ROUTES.CREATE}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm font-medium border-r border-blue-500 transition">
                        Create Lead
                    </button>

                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 transition">
                        <ChevronDown size={16} />
                    </button>
                </div>

                {/* More Menu */}
                <ButtonWithTitle title="Actions" className="h-9 w-13 border rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 transition">
                    <Ellipsis size={20} />
                </ButtonWithTitle>
            </div>

        </div>
    );
};

export default Toolbar;