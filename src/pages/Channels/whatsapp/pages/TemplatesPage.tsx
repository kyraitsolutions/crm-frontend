import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { WHATSAPP_PATHS } from "@/constants/routes/whatsapp.path";
import useDebounce from "@/hooks/useDebounce";
import { useAuthStore } from "@/stores";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/sidebar/Topbar";
import Explore from "../components/template-builder/Explore";
import TemplateTable from "../components/template-builder/TemplateTable";
import { useTemplateListStore } from "../store/template-list.store";
import { Input } from "@/components/ui/input";

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

  const renderStep = (status: string) => {
    switch (status) {
      case "explore":
        return <Explore />;
      case "all":
        return <TemplateTable type={status} />;
      case "draft":
        return <TemplateTable type={status} />;
      case "pending":
        return <TemplateTable type={status} />;
      case "approved":
        return <TemplateTable type={status} />;
      case "action-required":
        return <TemplateTable type={"rejected"} />;
      default:
        setStatus(undefined);
    }
  }

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
          <Input
            type="text"
            placeholder="Search templates (status, name etc.)"
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            className="input-field bg-white!"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate(WHATSAPP_PATHS.createTemplates())}
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
        <div className="overflow-y-scroll pb-5">
          {renderStep(active)}
          {/* {active === "explore" && <Explore />}
          {active === "all" && <TemplateTable type={"all"} />}
          {active === "draft" && <TemplateTable type={"draft"} />}
          {active === "pending" && <TemplateTable type={"pending"} />}
          {active === "approved" && <TemplateTable type={"approved"} />}
          {active === "action-required" && <TemplateTable type={"rejected"} />} */}
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
