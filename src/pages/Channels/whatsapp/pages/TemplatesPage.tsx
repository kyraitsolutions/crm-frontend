import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { WHATSAPP_PATHS } from "@/constants/routes/whatsapp.path";
import { useAuthStore } from "@/stores";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/sidebar/Topbar";
import Explore from "../components/template-builder/Explore";
import TemplateTable from "../components/template-builder/TemplateTable";
import { useTemplateListStore } from "../store/template-list.store";
import useDebounce from "@/hooks/useDebounce";

const TemplatesPage = () => {
  const navigate = useNavigate();
  const { accountId } = useAuthStore((state) => state);
  const [active, setActive] = useState<
    "explore" | "all" | "draft" | "pending" | "approved" | "action-required"
  >("explore");
  const [searchInputValue, setSearchInputValue] = useState("");

  const { fetchTemplates, filters, setStatus, loading, setSearch } =
    useTemplateListStore((state) => state);

  const debounceSearch = useDebounce(searchInputValue, 400);

  const getTemplates = async () => {
    try {
      await fetchTemplates(String(accountId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleTabChange = (tab: typeof active) => {
    setActive(tab);

    switch (tab) {
      case "explore":
      case "all":
        setStatus(undefined);
        break;

      case "draft":
        setStatus("DRAFT");
        break;

      case "pending":
        setStatus("PENDING");
        break;

      case "approved":
        setStatus("APPROVED");
        break;

      case "action-required":
        setStatus("REJECTED");
        break;

      default:
        setStatus(undefined);
    }
  };

  useEffect(() => {
    setSearch(debounceSearch);
  }, [debounceSearch]);

  useEffect(() => {
    if (!accountId || active === "explore") return;
    getTemplates();
  }, [filters, accountId]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center py-10">
        <div className="relative max-w-sm w-full ">
          <input
            type="text"
            placeholder="Search templates (status, name etc.)"
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            className="w-full bg-gray-100 rounded-xl! px-4 border-gray-300 py-2.5 pr-8 text-sm text-[#37322F] placeholder:text-[#847971] focus:outline-none focus:border-gray-300 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() =>
              navigate(WHATSAPP_PATHS.createTemplates(String(accountId)))
            }
            className="rounded"
          >
            Create Template
          </Button>
          <Button className="rounded action-btn! bg-teal-900 hover:bg-teal-900/80 text-white  hover:text-white transition-all duration-300">
            <RefreshCcw />
            Sync Status
          </Button>
        </div>
      </div>

      <Topbar active={active} onChange={handleTabChange} />

      {loading ? (
        <div className="flex justify-center mt-12">
          <Loader size={25} color="#162238" />
        </div>
      ) : (
        <div className=" overflow-y-scroll hide-scrollbar">
          {active === "explore" && <Explore />}
          {active === "all" && <TemplateTable type={"all"} />}
          {active === "draft" && <TemplateTable type={"draft"} />}
          {active === "pending" && <TemplateTable type={"pending"} />}
          {active === "approved" && <TemplateTable type={"approved"} />}
          {active === "action-required" && <TemplateTable type={"rejected"} />}
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
