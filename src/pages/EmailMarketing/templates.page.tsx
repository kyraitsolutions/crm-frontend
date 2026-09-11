import { FeatureGate } from "@/components/subscription/FeatureGate";
import { FEATURE } from "@/constants/subscription.constant";
import { useAuthStore } from "@/stores";
import { useEffect, useState } from "react";
import { useEmailMarketingStore } from "./store/email-marketing.store";
import { emailMarketingService } from "./services/email-marketing.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ToastMessageService } from "@/services";
import DataLoader from "@/components/Loader/data-loader";
import { CreateTemplateDialog } from "./components/CreateTemplateDialog";
import {
  Copy,
  FileText,
  Mail,
  MoreHorizontal,
  Plus,
  Trash2,
  Eye,
} from "lucide-react";
import type { EmailTemplate } from "./types";

const TemplatesPage = () => {
  const { accountId } = useAuthStore();
  const {
    templates,
    fetchTemplates,
    loading,
  } = useEmailMarketingStore();

  const toast = new ToastMessageService();

  const [createOpen, setCreateOpen] = useState(false);
  const [viewing, setViewing] = useState<EmailTemplate | null>(null);

  const id = String(accountId || "");

  useEffect(() => {
    if (accountId) {
      void fetchTemplates(String(accountId));
    }
  }, [accountId, fetchTemplates]);

  const handleDuplicate = async (template: EmailTemplate) => {
    try {
      const templateId = String(template.id || template._id);

      await emailMarketingService.duplicateTemplate(
        id,
        templateId,
      );

      toast.success("Template duplicated");

      await fetchTemplates(id);
    } catch (error: any) {
      toast.error(
        error?.message || "Could not duplicate template",
      );
    }
  };

  const handleDelete = async (template: EmailTemplate) => {
    try {
      const templateId = String(template.id || template._id);

      await emailMarketingService.deleteTemplate(
        id,
        templateId,
      );

      toast.success("Template deleted");

      await fetchTemplates(id);
    } catch (error: any) {
      toast.error(
        error?.message || "Could not delete template",
      );
    }
  };

  return (
    <FeatureGate feature={FEATURE.EMAIL_MARKETING}>
      {loading && templates.length === 0 ? (
        <div className="flex h-[calc(100vh-120px)] items-center justify-center">
          <DataLoader className="h-64" />
        </div>
      ) : (
        <div className="min-h-full bg-[#f8fafc]">
          <div className="mx-auto max-w-[1600px] space-y-5 p-5 lg:p-6">

            {/* ------------------------------------------------
                HEADER
            ------------------------------------------------ */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                  <Mail className="h-3.5 w-3.5" />
                  Email Marketing
                  <span className="text-slate-300">/</span>
                  Templates
                </div>

                <h1 className="text-xl font-semibold tracking-tight text-slate-950">
                  Templates
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Create reusable email templates for your campaigns.
                </p>
              </div>

              <Button
                onClick={() => setCreateOpen(true)}
                className="h-9 gap-2 px-4"
              >
                <Plus className="h-4 w-4" />
                Create template
              </Button>
            </div>

            {/* ------------------------------------------------
                TEMPLATE COUNT
            ------------------------------------------------ */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Email templates
                  </p>

                  <p className="text-xs text-slate-500">
                    {templates.length} template
                    {templates.length !== 1 ? "s" : ""} available
                  </p>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------
                TEMPLATES
            ------------------------------------------------ */}
            {templates.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {templates.map((template) => {
                  const templateId = String(
                    template.id || template._id,
                  );

                  return (
                    <TemplateCard
                      key={templateId}
                      template={template}
                      onView={() => setViewing(template)}
                      onDuplicate={() =>
                        void handleDuplicate(template)
                      }
                      onDelete={() =>
                        void handleDelete(template)
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyState
                onCreate={() => setCreateOpen(true)}
              />
            )}
          </div>
        </div>
      )}

      {/* Create template */}
      <CreateTemplateDialog
        open={createOpen}
        accountId={id}
        onClose={() => setCreateOpen(false)}
        onCreated={() => void fetchTemplates(id)}
      />

      {/* View template */}
      <Dialog
        open={Boolean(viewing)}
        onOpenChange={(open) => {
          if (!open) {
            setViewing(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl overflow-hidden p-0">

          <DialogHeader className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <DialogTitle className="truncate text-sm font-semibold text-slate-900">
                  {viewing?.name}
                </DialogTitle>

                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {viewing?.subject || "No subject"}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="bg-slate-50 p-5">
            <div className="mx-auto max-h-[70vh] max-w-[720px] overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
              <div
                className="p-5"
                dangerouslySetInnerHTML={{
                  __html: viewing?.html || "",
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </FeatureGate>
  );
};

/* ================================================================
   TEMPLATE CARD
================================================================ */

const TemplateCard = ({
  template,
  onView,
  onDuplicate,
  onDelete,
}: {
  template: EmailTemplate;
  onView: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) => {
  return (
    <Card className="group overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">

      {/* Email preview */}
      <div className="relative border-b border-slate-200 bg-slate-50 p-3">

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail className="h-3 w-3" />
            </div>

            <div className="h-2 w-20 rounded-full bg-slate-100" />
          </div>

          <div className="h-[150px] overflow-hidden px-3 py-3">
            <div
              className="pointer-events-none origin-top scale-[0.82] text-xs"
              dangerouslySetInnerHTML={{
                __html: template.html || "",
              }}
            />
          </div>
        </div>

        {/* Preview overlay */}
        <button
          type="button"
          onClick={onView}
          className="absolute inset-3 flex items-center justify-center rounded-lg bg-slate-900/0 opacity-0 transition-all group-hover:bg-slate-900/10 group-hover:opacity-100"
        >
          <span className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-md">
            <Eye className="h-3.5 w-3.5" />
            Preview
          </span>
        </button>
      </div>

      {/* Card content */}
      <CardHeader className="space-y-2 p-4 pb-2">
        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {template.name}
            </h3>

            <p className="mt-1 truncate text-xs text-slate-500">
              {template.subject || "No subject"}
            </p>
          </div>

          <Badge
            variant="secondary"
            className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
          >
            {template.category || "General"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-3">

        {/* Status */}
        <div className="mb-4 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          <span className="text-[11px] font-medium capitalize text-slate-500">
            {template.status || "active"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onView}
            className="h-8 flex-1 gap-1.5 border-slate-200 bg-white text-xs"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onDuplicate}
            className="h-8 gap-1.5 border-slate-200 bg-white px-3 text-xs"
          >
            <Copy className="h-3.5 w-3.5" />
            Duplicate
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            className="h-8 w-8 border-slate-200 bg-white p-0 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

/* ================================================================
   EMPTY STATE
================================================================ */

const EmptyState = ({
  onCreate,
}: {
  onCreate: () => void;
}) => {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-center shadow-sm">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Mail className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        No email templates yet
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
        Create a reusable email template to quickly build
        campaigns without starting from scratch.
      </p>

      <Button
        onClick={onCreate}
        className="mt-5 h-9 gap-2"
      >
        <Plus className="h-4 w-4" />
        Create template
      </Button>
    </div>
  );
};

export default TemplatesPage;