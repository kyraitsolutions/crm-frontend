import { FeatureGate } from "@/components/subscription/FeatureGate";
import { FEATURE } from "@/constants/subscription.constant";
import { EMAIL_MARKETING_PATHS } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  contactStatusOptions,
  sourceOptions,
} from "@/constants/dropdown.constant";
import { useAuthStore } from "@/stores";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { emailMarketingService } from "./services/email-marketing.service";
import { useEmailMarketingStore } from "./store/email-marketing.store";
import { ToastMessageService } from "@/services";
import DataLoader from "@/components/Loader/data-loader";
import {
  ArrowLeft,
  CalendarClock,
  FileText,
  Mail,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";

const audienceSources = [
  { label: "All sources", value: "all" },
  { label: "Chatbot", value: "chatbot" },
  ...sourceOptions,
];

const audienceStatuses = [
  { label: "All statuses", value: "all" },
  ...contactStatusOptions,
];

const CreateCampaignPage = () => {
  const { accountId } = useAuthStore();
  const navigate = useNavigate();
  const toast = new ToastMessageService();

  const {
    templates,
    fetchTemplates,
    loading,
  } = useEmailMarketingStore();

  const [preview, setPreview] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    fromName: "Kyra CRM",
    fromEmail: "",
    replyTo: "",
    templateId: "",
    source: "all",
    status: "subscribed",
    timezone:
      Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    scheduleType: "now" as "now" | "later",
    scheduledAt: "",
  });

  const id = String(accountId || "");

  const selectedTemplate = useMemo(
    () =>
      templates.find(
        (item) =>
          String(item.id || item._id) === form.templateId,
      ),
    [templates, form.templateId],
  );

  useEffect(() => {
    if (id) {
      void fetchTemplates(id);
    }
  }, [id, fetchTemplates]);

  useEffect(() => {
    if (!id) return;

    const filters: Record<string, string> = {};

    if (form.source !== "all") {
      filters.source = form.source;
    }

    if (form.status !== "all") {
      filters.status = form.status;
    }

    void emailMarketingService
      .previewAudience(id, {
        mode: Object.keys(filters).length ? "filters" : "all",
        filters,
      })
      .then((res) => setPreview(res.data?.doc))
      .catch(() => undefined);
  }, [id, form.source, form.status]);

  const saveAndSend = async (
    mode: "draft" | "now" | "later",
  ) => {
    if (!form.templateId) {
      toast.error(
        "Create and select a template before sending",
      );
      return;
    }

    if (mode === "later" && !form.scheduledAt) {
      toast.error(
        "Select a date and time for the campaign",
      );
      return;
    }

    try {
      setSaving(true);

      const filters: Record<string, string> = {};

      if (form.source !== "all") {
        filters.source = form.source;
      }

      if (form.status !== "all") {
        filters.status = form.status;
      }

      const created =
        await emailMarketingService.createCampaign(id, {
          name:
            form.name ||
            selectedTemplate?.name ||
            "Email campaign",
          fromName: form.fromName,
          fromEmail: form.fromEmail,
          replyTo: form.replyTo,
          templateId: form.templateId,
          timezone: form.timezone,
          audience: {
            mode: Object.keys(filters).length
              ? "filters"
              : "all",
            filters,
          },
        });

      const campaign = created.data?.doc;

      if (mode === "draft") {
        toast.success("Draft saved");
        navigate(
          EMAIL_MARKETING_PATHS.campaigns(id),
        );
        return;
      }

      if (mode === "later") {
        const local = new Date(form.scheduledAt);

        await emailMarketingService.schedule(
          id,
          campaign.id,
          {
            scheduledAt: local.toISOString(),
            timezone: form.timezone,
          },
        );

        toast.success("Campaign scheduled");
      } else {
        if (
          !window.confirm(
            "Send this campaign now to eligible contacts?",
          )
        ) {
          return;
        }

        await emailMarketingService.sendNow(
          id,
          campaign.id,
        );

        toast.success("Campaign queued for sending");
      }

      navigate(
        EMAIL_MARKETING_PATHS.campaign(
          id,
          campaign.id,
        ),
      );
    } catch (error: any) {
      toast.error(
        error?.message || "Could not save campaign",
      );
    } finally {
      setSaving(false);
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
          <div className="mx-auto max-w-[1200px] space-y-5 p-5 lg:p-6">

            {/* =================================================
                HEADER
            ================================================= */}
            <div>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Campaigns
              </button>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>

                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-slate-950">
                    Create campaign
                  </h1>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Create, schedule, and send an email
                    campaign to your contacts.
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                MAIN CONTENT
            ================================================= */}
            <div className="grid gap-5 lg:grid-cols-[1fr_360px]">

              {/* =================================================
                  LEFT
              ================================================= */}
              <div className="space-y-5">

                {/* -----------------------------------------------
                    CAMPAIGN DETAILS
                ----------------------------------------------- */}
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />

                      <h2 className="text-sm font-semibold text-slate-900">
                        Campaign details
                      </h2>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Configure the sender and select the
                      email template.
                    </p>
                  </div>

                  <div className="grid gap-5 p-5 md:grid-cols-2">

                    {/* Campaign name */}
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-sm font-medium text-slate-800">
                        Campaign name
                      </Label>

                      <Input
                        className="input-field"
                        value={form.name}
                        placeholder="e.g. Summer Sale Campaign"
                        onChange={(e) =>
                          setForm({
                            ...form,
                            name: e.target.value,
                          })
                        }
                      />

                      <p className="text-[11px] text-slate-400">
                        Used internally to identify this
                        campaign.
                      </p>
                    </div>

                    {/* Template */}
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-sm font-medium text-slate-800">
                        Email template
                      </Label>

                      <Select
                        value={
                          form.templateId || undefined
                        }
                        onValueChange={(templateId) =>
                          setForm({
                            ...form,
                            templateId,
                          })
                        }
                      >
                        <SelectTrigger className="input-field w-full">
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>

                        <SelectContent>
                          {templates.map((template) => (
                            <SelectItem
                              key={String(
                                template.id ||
                                template._id,
                              )}
                              value={String(
                                template.id ||
                                template._id,
                              )}
                            >
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {!templates.length && (
                        <p className="text-xs text-slate-500">
                          No templates yet.{" "}
                          <Link
                            className="font-medium text-primary hover:underline"
                            to={EMAIL_MARKETING_PATHS.templates(
                              id,
                            )}
                          >
                            Create a template
                          </Link>
                        </p>
                      )}
                    </div>

                    {/* From name */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-800">
                        From name
                      </Label>

                      <Input
                        className="input-field"
                        value={form.fromName}
                        placeholder="Kyra CRM"
                        onChange={(e) =>
                          setForm({
                            ...form,
                            fromName: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* From email */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-800">
                        From email
                      </Label>

                      <Input
                        className="input-field"
                        type="email"
                        value={form.fromEmail}
                        placeholder="hello@example.com"
                        onChange={(e) =>
                          setForm({
                            ...form,
                            fromEmail: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Reply to */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-800">
                        Reply-to
                      </Label>

                      <Input
                        className="input-field"
                        type="email"
                        value={form.replyTo}
                        placeholder="replies@example.com"
                        onChange={(e) =>
                          setForm({
                            ...form,
                            replyTo: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Timezone */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-800">
                        Timezone
                      </Label>

                      <Input
                        className="input-field"
                        value={form.timezone}
                        readOnly
                      />

                      <p className="text-[11px] text-slate-400">
                        Used when scheduling your campaign.
                      </p>
                    </div>
                  </div>
                </section>

                {/* -----------------------------------------------
                    AUDIENCE
                ----------------------------------------------- */}
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />

                      <h2 className="text-sm font-semibold text-slate-900">
                        Audience
                      </h2>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Choose which contacts should receive
                      this campaign.
                    </p>
                  </div>

                  <div className="grid gap-5 p-5 md:grid-cols-2">

                    {/* Source */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-800">
                        Contact source
                      </Label>

                      <Select
                        value={form.source}
                        onValueChange={(source) =>
                          setForm({
                            ...form,
                            source,
                          })
                        }
                      >
                        <SelectTrigger className="input-field w-full">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          {audienceSources.map(
                            (item) => (
                              <SelectItem
                                key={item.value}
                                value={item.value}
                              >
                                {item.label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-800">
                        Contact status
                      </Label>

                      <Select
                        value={form.status}
                        onValueChange={(status) =>
                          setForm({
                            ...form,
                            status,
                          })
                        }
                      >
                        <SelectTrigger className="input-field w-full">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          {audienceStatuses.map(
                            (item) => (
                              <SelectItem
                                key={item.value}
                                value={item.value}
                              >
                                {item.label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Audience summary */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Users className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">
                            {preview?.eligible?.toLocaleString?.() ||
                              0}
                          </p>

                          <p className="text-xs text-slate-500">
                            Eligible contacts
                          </p>
                        </div>

                        <div className="ml-auto flex items-center gap-4 text-right">
                          <AudienceMetric
                            label="With email"
                            value={
                              preview?.audience || 0
                            }
                          />

                          <AudienceMetric
                            label="Excluded"
                            value={
                              preview?.excluded || 0
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* -----------------------------------------------
                    DELIVERY
                ----------------------------------------------- */}
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4 text-primary" />

                      <h2 className="text-sm font-semibold text-slate-900">
                        Delivery
                      </h2>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Choose when the campaign should be
                      delivered.
                    </p>
                  </div>

                  <div className="p-5">

                    <div className="grid grid-cols-2 gap-3">

                      {/* Send now */}
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            scheduleType: "now",
                          })
                        }
                        className={[
                          "rounded-lg border p-4 text-left transition-all",
                          form.scheduleType === "now"
                            ? "border-primary bg-primary/5"
                            : "border-slate-200 hover:border-slate-300",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "mb-3 flex h-8 w-8 items-center justify-center rounded-full",
                            form.scheduleType ===
                              "now"
                              ? "bg-primary text-primary-foreground"
                              : "bg-slate-100 text-slate-500",
                          ].join(" ")}
                        >
                          <Send className="h-4 w-4" />
                        </div>

                        <p className="text-sm font-medium text-slate-900">
                          Send now
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Start sending as soon as the
                          campaign is launched.
                        </p>
                      </button>

                      {/* Schedule */}
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            scheduleType: "later",
                          })
                        }
                        className={[
                          "rounded-lg border p-4 text-left transition-all",
                          form.scheduleType === "later"
                            ? "border-primary bg-primary/5"
                            : "border-slate-200 hover:border-slate-300",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "mb-3 flex h-8 w-8 items-center justify-center rounded-full",
                            form.scheduleType ===
                              "later"
                              ? "bg-primary text-primary-foreground"
                              : "bg-slate-100 text-slate-500",
                          ].join(" ")}
                        >
                          <CalendarClock className="h-4 w-4" />
                        </div>

                        <p className="text-sm font-medium text-slate-900">
                          Schedule
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Choose a date and time for
                          delivery.
                        </p>
                      </button>
                    </div>

                    {form.scheduleType === "later" && (
                      <div className="mt-4 space-y-2">
                        <Label className="text-sm font-medium text-slate-800">
                          Scheduled date & time
                        </Label>

                        <Input
                          className="input-field"
                          type="datetime-local"
                          value={form.scheduledAt}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              scheduledAt:
                                e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                </section>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    disabled={saving}
                    onClick={() => navigate(-1)}
                    className="h-9 border-slate-200 bg-white px-4"
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="outline"
                    disabled={
                      saving || !form.templateId
                    }
                    onClick={() =>
                      void saveAndSend("draft")
                    }
                    className="h-9 px-4"
                  >
                    Save draft
                  </Button>

                  <Button
                    disabled={
                      saving || !form.templateId
                    }
                    onClick={() =>
                      void saveAndSend(
                        form.scheduleType ===
                          "later"
                          ? "later"
                          : "now",
                      )
                    }
                    className="h-9 gap-2 px-4"
                  >
                    {form.scheduleType === "later" ? (
                      <CalendarClock className="h-4 w-4" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}

                    {form.scheduleType === "later"
                      ? "Schedule campaign"
                      : "Send now"}
                  </Button>
                </div>

                {saving && (
                  <div className="flex justify-center">
                    <DataLoader className="h-16" />
                  </div>
                )}
              </div>

              {/* =================================================
                  RIGHT — PREVIEW
              ================================================= */}
              <div className="space-y-5">

                {/* Audience */}
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="text-sm font-semibold text-slate-900">
                      Audience preview
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Estimated campaign reach.
                    </p>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Users className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-2xl font-semibold tracking-tight text-slate-950">
                          {preview?.eligible?.toLocaleString?.() ||
                            0}
                        </p>

                        <p className="text-xs text-slate-500">
                          Eligible contacts
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                      <AudienceRow
                        label="Contacts with email"
                        value={
                          preview?.audience || 0
                        }
                      />

                      <AudienceRow
                        label="Eligible"
                        value={
                          preview?.eligible || 0
                        }
                      />

                      <AudienceRow
                        label="Excluded"
                        value={
                          preview?.excluded || 0
                        }
                      />
                    </div>
                  </div>
                </section>

                {/* Email preview */}
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="text-sm font-semibold text-slate-900">
                      Email preview
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Preview the selected template.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4">
                    {selectedTemplate ? (
                      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">

                        {/* Email header */}
                        <div className="border-b border-slate-100 px-4 py-3">
                          <p className="truncate text-xs font-medium text-slate-800">
                            {selectedTemplate.subject ||
                              "No subject"}
                          </p>

                          <div className="mt-2 space-y-1">
                            <p className="text-[10px] text-slate-400">
                              From:{" "}
                              <span className="text-slate-600">
                                {form.fromName ||
                                  "Kyra CRM"}
                              </span>
                            </p>

                            <p className="text-[10px] text-slate-400">
                              To:{" "}
                              <span className="text-slate-600">
                                Eligible contacts
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Email body */}
                        <div className="max-h-[420px] overflow-auto p-4">
                          <div
                            className="text-sm"
                            dangerouslySetInnerHTML={{
                              __html:
                                selectedTemplate.html ||
                                "",
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white px-5 text-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                          <Mail className="h-5 w-5" />
                        </div>

                        <p className="mt-3 text-sm font-medium text-slate-700">
                          No template selected
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Select an email template to
                          preview your message.
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Compliance */}
                <div className="flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                  <div>
                    <p className="text-xs font-medium text-emerald-800">
                      Email delivery best practices
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-emerald-700/80">
                      Send campaigns only to contacts who
                      have opted in to receive marketing
                      emails.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </FeatureGate>
  );
};

/* ================================================================
   AUDIENCE ROW
================================================================ */

const AudienceRow = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-medium text-slate-800">
        {Number(value || 0).toLocaleString()}
      </span>
    </div>
  );
};

/* ================================================================
   AUDIENCE METRIC
================================================================ */

const AudienceMetric = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-800">
        {Number(value || 0).toLocaleString()}
      </p>

      <p className="text-[10px] text-slate-400">
        {label}
      </p>
    </div>
  );
};

export default CreateCampaignPage;