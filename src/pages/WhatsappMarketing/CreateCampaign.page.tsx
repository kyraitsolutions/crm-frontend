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
    try {
      setSaving(true);
      const filters: Record<string, string> = {};
      if (form.source !== "all") filters.source = form.source;
      const created = await whatsappBroadcastService.createCampaign(id, {
        name: form.name || selectedTemplate?.name || "WhatsApp campaign",
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
      navigate(WHATSAPP_MARKETING_PATHS.campaign(id, campaign.id));
    } catch (error: any) {
      toast.error(error?.message || "Could not create campaign");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FeatureGate feature={FEATURE.WHATSAPP_MESSAGING}>
      <div className="p-6 max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold">New WhatsApp campaign</h1>
        {preview && (
          <p className="text-sm rounded border p-3">
            Contacts with phone: {preview.audience} · Eligible (opted in): {preview.eligible} ·
            Excluded: {preview.excluded}
          </p>
        )}
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Marketing template</Label>
          <Select
            value={form.templateId || undefined}
            onValueChange={(templateId) => setForm({ ...form, templateId })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Approved MARKETING templates only" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={String(template.id || template._id)} value={String(template.id || template._id)}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Source</Label>
          <Select value={form.source} onValueChange={(source) => setForm({ ...form, source })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              {sourceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between rounded-xl border p-3">
          <span className="text-sm">Exclude opted-out contacts</span>
          <Switch
            checked={form.excludeOptedOut}
            onCheckedChange={(excludeOptedOut) => setForm({ ...form, excludeOptedOut })}
          />
        </div>
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
        <Button disabled={saving || !form.templateId} onClick={() => void launch()}>
          Launch campaign
        </Button>
        {saving && <DataLoader className="h-16" />}
      </div>
    </FeatureGate>
  );
};

export default CreateWhatsAppCampaignPage;
