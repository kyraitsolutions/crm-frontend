import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { WHATSAPP_PATHS } from "@/constants/routes/whatsapp.path";
import useDebounce from "@/hooks/useDebounce";
import { useAuthStore } from "@/stores";
import { Plus} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/sidebar/Topbar";
// import Explore from "../components/template-builder/Explore";
import TemplateTable from "../components/template-builder/TemplateTable";
import { useTemplateListStore } from "../store/template-list.store";
import { Input } from "@/components/ui/input";
import TemplateJourneyModal from "../components/template-builder/ui/TemplateViewer";
import type { TemplateJourney } from "../types/templates/template.type";

const TemplatesPage = () => {
  const navigate = useNavigate();
  const { accountId } = useAuthStore((state) => state);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateJourney | null>(null);
  const [active, setActive] = useState<
    "explore" | "all" | "draft" | "pending" | "approved" | "action-required"
  >("all");
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
      // case "explore":
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
      // case "explore":
      //   return <Explore />;
      case "action-required":
        return (
          <TemplateTable
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            type={"rejected"}
          />
        );
      default:
        return (
          <TemplateTable
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            type={status}
          />
        );
    }
  };

  useEffect(() => {
    setSearch(debounceSearch);
  }, [debounceSearch]);

  useEffect(() => {
    if (!accountId || active === "explore") return;
    getTemplates();
  }, [filters, accountId, active]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-5">
        <div className="relative w-full max-w-md">
          <Input
            type="text"
            placeholder="Search templates (status, name etc.)"
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            className="input-field bg-white! rounded-xl!"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => navigate(WHATSAPP_PATHS.createTemplates())}
            className="rounded-xl!"
          >
            <Plus /> Create Template
          </Button>
          {/* <Button className="rounded-xl! action-btn! bg-teal-900 hover:bg-teal-900/80 text-white hover:text-white transition-all duration-300">
            <RefreshCcw className="h-4 w-4" />
            Sync Status
          </Button> */}
        </div>
      </div>

      <Topbar active={active} onChange={handleTabChange} />

      {selectedTemplate && (
        <TemplateJourneyModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      )}

      {loading ? (
        <div className="flex justify-center mt-10">
          <Loader size={25} color="#162238" />
        </div>
      ) : (
        <div className="mt-4 overflow-y-auto pb-6">{renderStep(active)}</div>
      )}
    </div>
  );
};

export default TemplatesPage;
