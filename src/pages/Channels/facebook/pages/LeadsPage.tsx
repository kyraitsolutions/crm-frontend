import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataLoader from "@/components/Loader/data-loader";
import useDebounce from "@/hooks/useDebounce";
import { ToastMessageService } from "@/services";
import { useAuthStore } from "@/stores";
import type { ApiError } from "@/types";
import { RefreshCcw, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { FacebookPageShell } from "../components/FacebookPageShell";
import { PaginationBar } from "../components/PaginationBar";
import { PermissionWarning } from "../components/PermissionWarning";
import { GlassCard } from "@/pages/Channels/whatsapp/components/cards/GlassCard";
import { useMetaPageStore } from "../store/meta-page.store";
import { formatFacebookDate } from "../utils/format";
import { useActiveFacebookPage } from "../utils/pages";

const LeadsPage = () => {
  const accountId = useAuthStore((state) => state.accountId);
  const toastService = new ToastMessageService();
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 400);
  const {
    leads,
    leadsWarning,
    leadsLoading,
    leadsPage,
    leadsTotalPages,
    leadsTotal,
    fetchLeads,
  } = useMetaPageStore((state) => state);
  const { activePageId } = useActiveFacebookPage();

  const loadLeads = async (page = 1) => {
    if (!accountId) return;
    try {
      await fetchLeads(String(accountId), {
        page,
        search: debounceSearch,
      });
    } catch (error) {
      const err = error as ApiError;
      toastService.error(err.message || "Failed to load Facebook leads");
    }
  };

  useEffect(() => {
    loadLeads(1);
  }, [accountId, debounceSearch, activePageId]);

  return (
    <FacebookPageShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Leads</h2>
          <p className="text-sm text-slate-500">
            Leads captured from Facebook Lead Ads for this Page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, phone"
            className="w-64 bg-white"
          />
          <Button variant="outline" onClick={() => loadLeads(leadsPage)} disabled={leadsLoading}>
            <RefreshCcw className="size-4" />
            Refresh
          </Button>
        </div>
      </div>

      <PermissionWarning message={leadsWarning} />

      {leadsLoading ? (
        <DataLoader className="h-[40vh]" />
      ) : leads.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Facebook leads yet"
          description="New Lead Ads submissions will show up here after the Page webhook is subscribed."
        />
      ) : (
        <>
          <p className="text-xs text-slate-400">{leadsTotal} leads</p>
          <GlassCard className="p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Form</TableHead>
                  <TableHead>Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead._id || lead.id}>
                    <TableCell className="font-medium text-slate-800">
                      {lead.name || "—"}
                    </TableCell>
                    <TableCell>{lead.email || "—"}</TableCell>
                    <TableCell>{lead.phone || lead.mobile || "—"}</TableCell>
                    <TableCell className="capitalize">
                      {lead.stage || lead.status || "—"}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {lead.source?.formId || "—"}
                    </TableCell>
                    <TableCell>
                      {formatFacebookDate(
                        lead.source?.createdTime || lead.createdAt,
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassCard>

          <PaginationBar
            page={leadsPage}
            totalPages={leadsTotalPages}
            loading={leadsLoading}
            onPageChange={loadLeads}
          />
        </>
      )}
    </FacebookPageShell>
  );
};

export default LeadsPage;
