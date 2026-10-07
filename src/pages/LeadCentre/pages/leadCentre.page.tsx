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
    <div className="relative min-w-0 w-full max-w-full overflow-x-hidden pb-4">
      <LeadListHeader />
      <Toolbar />
      <LeadTable />
    </div>
  );
};

export default LeadCenter;
