import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataLoader from "@/components/Loader/data-loader";
import { ToastMessageService } from "@/services";
import { useAuthStore } from "@/stores";
import type { ApiError } from "@/types";
import { ClipboardList, RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import { EmptyState } from "../components/EmptyState";
import { FacebookPageShell } from "../components/FacebookPageShell";
import { PaginationBar } from "../components/PaginationBar";
import { PermissionWarning } from "../components/PermissionWarning";
import { GlassCard } from "@/pages/Channels/whatsapp/components/cards/GlassCard";
import { useMetaPageStore } from "../store/meta-page.store";
import { formatFacebookDate, formatFacebookNumber } from "../utils/format";
import { useActiveFacebookPage } from "../utils/pages";

const LeadFormsPage = () => {
  const accountId = useAuthStore((state) => state.accountId);
  const toastService = new ToastMessageService();
  const { forms, formsWarning, formsLoading, formsPage, formsTotalPages, fetchForms } =
    useMetaPageStore((state) => state);
  const { activePageId } = useActiveFacebookPage();

  const loadForms = async (page = 1) => {
    if (!accountId) return;
    try {
      await fetchForms(String(accountId), page);
    } catch (error) {
      const err = error as ApiError;
      toastService.error(err.message || "Failed to load lead forms");
    }
  };

  useEffect(() => {
    loadForms(1);
  }, [accountId, activePageId]);

  return (
    <FacebookPageShell>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Lead Forms</h2>
          <p className="text-sm text-slate-500">
            Instant Forms attached to this Facebook Page for Lead Ads.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => loadForms(formsPage)}
          disabled={formsLoading}
        >
          <RefreshCcw className="size-4" />
          Refresh
        </Button>
      </div>

      <PermissionWarning message={formsWarning} />

      {formsLoading ? (
        <DataLoader className="h-[40vh]" />
      ) : forms.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No lead forms found"
          description="Create a Lead Form in Meta Ads Manager, or reconnect Facebook with leads_retrieval if a permission warning is shown."
        />
      ) : (
        <GlassCard className="p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Questions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>
                    <div className="font-medium text-slate-800">{form.name}</div>
                    <div className="text-xs text-slate-400">{form.id}</div>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-600">
                      {form.status?.toLowerCase() || "—"}
                    </span>
                  </TableCell>
                  <TableCell>{formatFacebookNumber(form.leadsCount)}</TableCell>
                  <TableCell>{formatFacebookDate(form.createdTime)}</TableCell>
                  <TableCell className="max-w-xs truncate text-slate-500">
                    {form.questions?.length
                      ? form.questions
                          .map((question) => question.label || question.key)
                          .filter(Boolean)
                          .join(", ")
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GlassCard>
      )}

      <PaginationBar
        page={formsPage}
        totalPages={formsTotalPages}
        loading={formsLoading}
        onPageChange={loadForms}
      />
    </FacebookPageShell>
  );
};

export default LeadFormsPage;
