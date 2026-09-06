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
import { contactStatusOptions, sourceOptions } from "@/constants/dropdown.constant";
import { useAuthStore } from "@/stores";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { emailMarketingService } from "./services/email-marketing.service";
import { useEmailMarketingStore } from "./store/email-marketing.store";
import { ToastMessageService } from "@/services";
import DataLoader from "@/components/Loader/data-loader";

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
  const { templates, fetchTemplates, loading } = useEmailMarketingStore();
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
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    scheduleType: "now" as "now" | "later",
    scheduledAt: "",
  });

  const id = String(accountId || "");
  const selectedTemplate = useMemo(
    () => templates.find((item) => String(item.id || item._id) === form.templateId),
    [templates, form.templateId],
  );

  useEffect(() => {
    if (id) void fetchTemplates(id);
  }, [id, fetchTemplates]);

  useEffect(() => {
    if (!id) return;
    const filters: Record<string, string> = {};
    if (form.source !== "all") filters.source = form.source;
    if (form.status !== "all") filters.status = form.status;
    void emailMarketingService
      .previewAudience(id, {
        mode: Object.keys(filters).length ? "filters" : "all",
        filters,
      })
      .then((res) => setPreview(res.data?.doc))
      .catch(() => undefined);
  }, [id, form.source, form.status]);

  const saveAndSend = async (mode: "draft" | "now" | "later") => {
    if (!form.templateId) {
      toast.error("Create and select a template before sending");
      return;
    }
    try {
      setSaving(true);
      const filters: Record<string, string> = {};
      if (form.source !== "all") filters.source = form.source;
      if (form.status !== "all") filters.status = form.status;
      const created = await emailMarketingService.createCampaign(id, {
        name: form.name || selectedTemplate?.name,
        fromName: form.fromName,
        fromEmail: form.fromEmail,
        replyTo: form.replyTo,
        templateId: form.templateId,
        timezone: form.timezone,
        audience: {
          mode: Object.keys(filters).length ? "filters" : "all",
          filters,
        },
      });
      const campaign = created.data?.doc;
      if (mode === "draft") {
        toast.success("Draft saved");
        navigate(EMAIL_MARKETING_PATHS.campaigns(id));
        return;
      }
      if (mode === "later") {
        const local = new Date(form.scheduledAt);
        await emailMarketingService.schedule(id, campaign.id, {
          scheduledAt: local.toISOString(),
          timezone: form.timezone,
        });
        toast.success("Campaign scheduled");
      } else {
        if (!window.confirm("Send this campaign now to eligible contacts?")) return;
        await emailMarketingService.sendNow(id, campaign.id);
        toast.success("Campaign queued for sending");
      }
      navigate(EMAIL_MARKETING_PATHS.campaign(id, campaign.id));
    } catch (error: any) {
      toast.error(error?.message || "Could not save campaign");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FeatureGate feature={FEATURE.EMAIL_MARKETING}>
      {loading && templates.length === 0 ? (
        <DataLoader className="h-[calc(100vh-220px)]" />
      ) : (
        <div className="p-6 max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Create campaign</h1>
            <p className="text-sm text-muted-foreground">
              Campaigns send a saved template to contacts. Create the template first.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Campaign name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Template</Label>
              <Select
                value={form.templateId || undefined}
                onValueChange={(templateId) => setForm({ ...form, templateId })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={String(template.id || template._id)} value={String(template.id || template._id)}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!templates.length && (
                <p className="text-xs text-muted-foreground">
                  No templates yet.{" "}
                  <Link className="text-primary" to={EMAIL_MARKETING_PATHS.templates(id)}>
                    Create a template
                  </Link>
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>From name</Label>
              <Input value={form.fromName} onChange={(e) => setForm({ ...form, fromName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>From email</Label>
              <Input value={form.fromEmail} onChange={(e) => setForm({ ...form, fromEmail: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Reply-to</Label>
              <Input value={form.replyTo} onChange={(e) => setForm({ ...form, replyTo: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Contact source</Label>
              <Select value={form.source} onValueChange={(source) => setForm({ ...form, source })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {audienceSources.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Contact status</Label>
              <Select value={form.status} onValueChange={(status) => setForm({ ...form, status })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {audienceStatuses.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {preview && (
            <div className="rounded border p-3 text-sm">
              Contacts with email: {preview.audience} · Eligible: {preview.eligible} · Excluded: {preview.excluded}
            </div>
          )}

          {selectedTemplate && (
            <div className="space-y-2">
              <Label>Template preview</Label>
              <div className="border rounded bg-white p-4">
                <p className="text-xs text-muted-foreground">{selectedTemplate.subject}</p>
                <div dangerouslySetInnerHTML={{ __html: selectedTemplate.html }} />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label>Send</Label>
            <div className="flex gap-2">
              <Button
                variant={form.scheduleType === "now" ? "default" : "outline"}
                onClick={() => setForm({ ...form, scheduleType: "now" })}
              >
                Send now
              </Button>
              <Button
                variant={form.scheduleType === "later" ? "default" : "outline"}
                onClick={() => setForm({ ...form, scheduleType: "later" })}
              >
                Schedule
              </Button>
            </div>
            {form.scheduleType === "later" && (
              <Input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              />
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" disabled={saving} onClick={() => void saveAndSend("draft")}>
              Save draft
            </Button>
            <Button
              disabled={saving || !form.templateId}
              onClick={() => void saveAndSend(form.scheduleType === "later" ? "later" : "now")}
            >
              {form.scheduleType === "later" ? "Schedule campaign" : "Send now"}
            </Button>
          </div>
          {saving && <DataLoader className="h-32" />}
        </div>
      )}
    </FeatureGate>
  );
};

export default CreateCampaignPage;
