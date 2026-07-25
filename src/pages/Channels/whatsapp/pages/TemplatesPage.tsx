import { useState } from "react";
import Topbar from "../components/sidebar/Topbar";
import Explore from "../components/template-builder/Explore";
import TemplateTable from "../components/template-builder/TemplateTable";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { WHATSAPP_PATHS } from "@/constants/routes/whatsapp.path";
import { useAuthStore } from "@/stores";
import { useNavigate } from "react-router-dom";

const TemplatesPage = () => {
  const { accountId } = useAuthStore((state) => state);
  const navigate = useNavigate();
  const [active, setActive] = useState<string>("explore");
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center py-10">
        <div className="relative max-w-sm w-full ">
          <input
            type="text"
            placeholder="Search templates (status, name etc.)"
            value={""}
            // onChange={(e) => setContactQuery({ search: e.target.value, })}
            className="w-full bg-gray-100 rounded-xl! px-4 border-gray-300 py-2.5 pr-8 text-sm text-[#37322F] placeholder:text-[#847971] focus:outline-none focus:border-gray-300 transition"
          />


        </div>
        <div className="flex items-center gap-2">

          <Button onClick={() => navigate(WHATSAPP_PATHS.createTemplates(String(accountId)))} className="rounded">
            Create Template
          </Button>
          <Button className="rounded action-btn! bg-teal-900 hover:bg-teal-900/80 text-white  hover:text-white transition-all duration-300">
            <RefreshCcw />
            Sync Status
          </Button>
        </div>
      </div>

      <Topbar active={active} setActive={setActive} />
      <div className="h-[70vh] overflow-y-scroll hide-scrollbar">

        {active === "explore" && <Explore />}
        {active === "all" && <TemplateTable type={"all"} />}
        {active === "draft" && <TemplateTable type={"draft"} />}
        {active === "pending" && <TemplateTable type={"pending"} />}
        {active === "approved" && <TemplateTable type={"approved"} />}
        {active === "action-required" && <TemplateTable type={"rejected"} />}
      </div>

    </div>
  );
};

export default TemplatesPage;
