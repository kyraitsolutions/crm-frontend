import { FeatureGate } from "@/components/subscription/FeatureGate";
import { FEATURE } from "@/constants/subscription.constant";
import { WHATSAPP_MARKETING_PATHS } from "@/constants/routes/whatsapp-marketing.path";
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
import { sourceOptions } from "@/constants/dropdown.constant";
import { useAuthStore } from "@/stores";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  MessageCircle,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";
import { whatsappBroadcastService } from "./services/whatsapp-broadcast.service";
import { useWhatsAppMarketingStore } from "./store/whatsapp-marketing.store";
import { ToastMessageService } from "@/services";
import DataLoader from "@/components/Loader/data-loader";
import { Switch } from "@/components/ui/switch";

const CreateWhatsAppCampaignPage = () => {
  const { accountId } = useAuthStore();
  const navigate = useNavigate();
  const toast = new ToastMessageService();

  const { templates, fetchTemplates } = useWhatsAppMarketingStore();

  const [preview, setPreview] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    templateId: "",
    source: "all",
    excludeOptedOut: true,
    scheduleType: "now" as "now" | "later",
    scheduledAt: "",
  });

  const id = String(accountId || "");

  const selectedTemplate = useMemo(
    () =>
      templates.find(
        (item) => String(item.id || item._id) === form.templateId,
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

    void whatsappBroadcastService
      .previewAudience(id, {
        audience: {
          mode: Object.keys(filters).length ? "filters" : "all",
          filters,
        },
        excludeOptedOut: form.excludeOptedOut,
      })
      .then((res) => setPreview(res.data?.doc))
      .catch(() => undefined);
  }, [id, form.source, form.excludeOptedOut]);

  const launch = async () => {
    if (!form.templateId) {
      toast.error("Select an approved marketing template");
      return;
    }

    if (form.scheduleType === "later" && !form.scheduledAt) {
      toast.error("Select a date and time for the campaign");
      return;
    }

    try {
      setSaving(true);

      const filters: Record<string, string> = {};

      if (form.source !== "all") {
        filters.source = form.source;
      }

      const created = await whatsappBroadcastService.createCampaign(id, {
        name:
          form.name ||
          selectedTemplate?.name ||
          "WhatsApp campaign",
        templateId: form.templateId,
        audience: {
          mode: Object.keys(filters).length ? "filters" : "all",
          filters,
        },
        excludeOptedOut: form.excludeOptedOut,
      });

      const campaign = created.data?.doc;

      if (form.scheduleType === "later") {
        await whatsappBroadcastService.schedule(id, campaign.id, {
          scheduledAt: new Date(form.scheduledAt).toISOString(),
        });
      } else {
        await whatsappBroadcastService.sendNow(id, campaign.id);
      }

      toast.success("Campaign queued");

      navigate(
        WHATSAPP_MARKETING_PATHS.campaign(id, campaign.id),
      );
    } catch (error: any) {
      toast.error(error?.message || "Could not create campaign");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FeatureGate feature={FEATURE.WHATSAPP_MESSAGING}>
      <div className="min-h-full bg-[#f8fafc]">
        <div className="mx-auto max-w-[1200px] space-y-5 p-5 lg:p-6">

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0ea]">
                  <MessageCircle className="h-5 w-5 text-[#ff5a1f]" />
                </div>

                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-slate-950">
                    New WhatsApp campaign
                  </h1>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Create and send a marketing campaign to your opted-in
                    contacts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Layout */}
          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">

            {/* ------------------------------------------------
                LEFT — CAMPAIGN FORM
            ------------------------------------------------ */}
            <div className="space-y-5">

              {/* Campaign Details */}
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Campaign details
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Configure the campaign and choose the message template.
                  </p>
                </div>

                <div className="space-y-5 p-5">

                  {/* Name */}
                  <div className="space-y-2">
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
                      Give your campaign a name so you can easily identify it
                      later.
                    </p>
                  </div>

                  {/* Template */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-800">
                      Marketing template
                    </Label>

                    <Select
                      value={form.templateId || undefined}
                      onValueChange={(templateId) =>
                        setForm({
                          ...form,
                          templateId,
                        })
                      }
                    >
                      <SelectTrigger className="input-field w-full">
                        <SelectValue placeholder="Select an approved marketing template" />
                      </SelectTrigger>

                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem
                            key={String(
                              template.id || template._id,
                            )}
                            value={String(
                              template.id || template._id,
                            )}
                          >
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Only approved marketing templates can be used.
                    </div>
                  </div>

                  {/* Source */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-800">
                      Audience source
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
                        <SelectItem value="all">
                          All sources
                        </SelectItem>

                        {sourceOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <p className="text-[11px] text-slate-400">
                      Choose which contacts should receive this campaign.
                    </p>
                  </div>

                  {/* Opt-out */}
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <ShieldCheck className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          Exclude opted-out contacts
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Recommended to protect contact preferences.
                        </p>
                      </div>
                    </div>

                    <Switch
                      checked={form.excludeOptedOut}
                      onCheckedChange={(excludeOptedOut) =>
                        setForm({
                          ...form,
                          excludeOptedOut,
                        })
                      }
                    />
                  </div>
                </div>
              </section>

              {/* Delivery */}
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Delivery
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Choose when you want to send this campaign.
                  </p>
                </div>

                <div className="p-5">

                  {/* Send type */}
                  <div className="grid grid-cols-2 gap-3">

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
                          ? "border-primary bg-[#fff8f5]"
                          : "border-slate-200 hover:border-slate-300",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "mb-3 flex h-8 w-8 items-center justify-center rounded-full",
                          form.scheduleType === "now"
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-500",
                        ].join(" ")}
                      >
                        <Send className="h-4 w-4" />
                      </div>

                      <p className="text-sm font-medium text-slate-900">
                        Send now
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Start sending as soon as the campaign is launched.
                      </p>
                    </button>

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
                          ? "border-primary bg-[#fff8f5]"
                          : "border-slate-200 hover:border-slate-300",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "mb-3 flex h-8 w-8 items-center justify-center rounded-full",
                          form.scheduleType === "later"
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-500",
                        ].join(" ")}
                      >
                        <CalendarClock className="h-4 w-4" />
                      </div>

                      <p className="text-sm font-medium text-slate-900">
                        Schedule
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Choose a date and time for delivery.
                      </p>
                    </button>
                  </div>

                  {/* Scheduled date */}
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
                            scheduledAt: e.target.value,
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
                  className="rounded-xl"
                >
                  Cancel
                </Button>

                <Button
                  disabled={saving || !form.templateId}
                  onClick={() => void launch()}
                  className=" rounded-xl"
                >
                  <Send className="h-4 w-4" />
                  {saving ? "Launching..." : "Launch campaign"}
                </Button>
              </div>

              {saving && (
                <div className="flex justify-center">
                  <DataLoader className="h-16" />
                </div>
              )}
            </div>

            {/* ------------------------------------------------
                RIGHT — LIVE PREVIEW
            ------------------------------------------------ */}
            <div className="space-y-5">

              {/* Audience */}
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Audience
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Estimated recipients for this campaign.
                  </p>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <Users className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-2xl font-semibold tracking-tight text-slate-950">
                        {preview?.eligible?.toLocaleString?.() || 0}
                      </p>

                      <p className="text-xs text-slate-500">
                        Eligible contacts
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                    <AudienceRow
                      label="Contacts with phone"
                      value={preview?.audience || 0}
                    />

                    <AudienceRow
                      label="Eligible / opted in"
                      value={preview?.eligible || 0}
                    />

                    <AudienceRow
                      label="Excluded"
                      value={preview?.excluded || 0}
                    />
                  </div>
                </div>
              </section>

              {/* Template Preview */}
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Message preview
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Preview the selected WhatsApp template.
                  </p>
                </div>

                <div className="p-5">
                  {selectedTemplate ? (
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

                      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                          <MessageCircle className="h-3.5 w-3.5" />
                        </div>

                        <div>
                          <p className="text-xs font-medium text-slate-800">
                            WhatsApp
                          </p>

                          <p className="text-[10px] text-slate-400">
                            Marketing message
                          </p>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="rounded-lg rounded-tl-none bg-white p-3 shadow-sm">
                          <p className="text-xs font-medium text-slate-800">
                            {selectedTemplate.name}
                          </p>

                          {selectedTemplate.body && (
                            <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-slate-600">
                              {selectedTemplate.body}
                            </p>
                          )}

                          <div className="mt-2 text-right text-[9px] text-slate-400">
                            Marketing template
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-5 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <MessageCircle className="h-5 w-5" />
                      </div>

                      <p className="mt-3 text-sm font-medium text-slate-700">
                        No template selected
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Select an approved marketing template to preview
                        your message.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Safety note */}
              <div className="flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                <div>
                  <p className="text-xs font-medium text-emerald-800">
                    WhatsApp marketing compliance
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-emerald-700/80">
                    Only opted-in contacts will be included when exclusion
                    is enabled. Make sure your campaign follows WhatsApp
                    Business messaging policies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FeatureGate>
  );
};

const AudienceRow = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-500">{label}</span>

      <span className="font-medium text-slate-800">
        {Number(value || 0).toLocaleString()}
      </span>
    </div>
  );
};

export default CreateWhatsAppCampaignPage;