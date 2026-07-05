// import useDebounce from "@/hooks/useDebounce";
import { useAuthStore } from "@/stores";
import { useEffect } from "react";
import LeadListHeader from "../components/list/LeadListHeader";
import LeadTable from "../components/list/LeadTable";
import Toolbar from "../components/list/Toolbar";
import { useLeadsStore } from "../store/lead.store";

const LeadCenter = () => {
  const { accountId } = useAuthStore();

  const { leadQuery, fetchLeads } = useLeadsStore();

  useEffect(() => {
    if (!accountId) return;
    fetchLeads(String(accountId));
  }, [accountId, leadQuery]);

  return (
    <div className="relative">
      {/* <h1 className="text-xl font-semibold border-b py-2 px-5 ">Leads</h1> */}

      {/* Lead list header  */}
      <LeadListHeader />
      {/* Toolbar */}
      <Toolbar />
      {/* Lead table */}
      <LeadTable />
    </div>
  );
};

export default LeadCenter;
