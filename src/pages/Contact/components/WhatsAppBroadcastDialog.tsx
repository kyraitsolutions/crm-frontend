import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CountryCodeSelect } from "@/components/common/CountryCodeSelect";
import { FeatureGate } from "@/components/subscription/FeatureGate";
import { FEATURE } from "@/constants/subscription.constant";
import { WHATSAPP_MARKETING_PATHS } from "@/constants/routes/whatsapp-marketing.path";
import { WHATSAPP_PATHS } from "@/constants/routes/whatsapp.path";
import DataLoader from "@/components/Loader/data-loader";
import { ToastMessageService } from "@/services";
import { whatsappBroadcastService } from "@/pages/WhatsappMarketing/services/whatsapp-broadcast.service";
import { useWhatsAppMarketingStore } from "@/pages/WhatsappMarketing/store/whatsapp-marketing.store";
import { Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { CountryCode } from "libphonenumber-js/core";
import { getCountryCallingCode } from "react-phone-number-input";

type WhatsAppBroadcastDialogProps = {
  open: boolean;
  accountId: string;
  contactIds: string[];
  selectAllMatching: boolean;
  audienceFilters: Record<string, string>;
  selectedCount: number;
  onClose: () => void;
};

export function WhatsAppBroadcastDialog({
  open,
  accountId,
  contactIds,
  selectAllMatching,
  audienceFilters,
  selectedCount,
  onClose,
}: WhatsAppBroadcastDialogProps) {
  const navigate = useNavigate();
  const toast = new ToastMessageService();
  const { templates, context, fetchTemplates, fetchContext } =
    useWhatsAppMarketingStore();
  const [preview, setPreview] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [excludeOptedOut, setExcludeOptedOut] = useState(true);
  const [form, setForm] = useState({
    name: "",
    templateId: "",
    scheduledAt: "",
    testName: "",
    testCountry: "IN",
    testPhone: "",
  });

  const selectedTemplate = useMemo(
    () => templates.find((item) => String(item.id || item._id) === form.templateId),
    [templates, form.templateId],
  );

  const contactIdKey = contactIds.join(",");
  const filterKey = JSON.stringify(audienceFilters);
  const audience = useMemo(() => {
    if (selectAllMatching) {
      return {
        mode: Object.keys(audienceFilters).length ? "filters" : "all",
        filters: audienceFilters,
      };
    }
    return { mode: "contacts" as const, contactIds, filters: {} };
  }, [selectAllMatching, filterKey, contactIdKey]);

  useEffect(() => {
    if (open && accountId) {
      void fetchTemplates(accountId);
      void fetchContext(accountId);
    }
  }, [open, accountId, fetchTemplates, fetchContext]);

  useEffect(() => {
    if (!open || !accountId) return;
    void whatsappBroadcastService
      .previewAudience(accountId, { audience, excludeOptedOut })
      .then((res) => setPreview(res.data?.doc))
      .catch(() => undefined);
  }, [open, accountId, selectAllMatching, contactIdKey, filterKey, excludeOptedOut]);

  const launch = async () => {
    if (!form.templateId) {
      toast.error("Select an approved marketing template");
      return;
    }
    if (scheduleEnabled && !form.scheduledAt) {
      toast.error("Choose a schedule date and time");
      return;
    }
    try {
      setSaving(true);
      const created = await whatsappBroadcastService.createCampaign(accountId, {
        name: form.name || selectedTemplate?.name || "WhatsApp campaign",
        templateId: form.templateId,
        audience,
        excludeOptedOut,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      });
      const campaign = created.data?.doc;
      if (scheduleEnabled) {
        await whatsappBroadcastService.schedule(accountId, campaign.id, {
          scheduledAt: new Date(form.scheduledAt).toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        });
        toast.success("Campaign scheduled");
      } else {
        await whatsappBroadcastService.sendNow(accountId, campaign.id);
        toast.success("Campaign queued for sending");
      }
      onClose();
      navigate(WHATSAPP_MARKETING_PATHS.campaign(accountId, campaign.id));
    } catch (error: any) {
      toast.error(error?.message || "Could not launch campaign");
    } finally {
      setSaving(false);
    }
  };

  const sendTest = async () => {
    if (!form.templateId) {
      toast.error("Select a template first");
      return;
    }
    if (!form.testPhone.trim()) {
      toast.error("Enter a WhatsApp number for the test");
      return;
    }
    try {
      setTesting(true);
      const callingCode = getCountryCallingCode(form.testCountry as CountryCode);
      await whatsappBroadcastService.test(accountId, {
        templateId: form.templateId,
        name: form.testName,
        phone: `${callingCode}${form.testPhone.replace(/\D/g, "")}`,
      });
      toast.success("Test message sent");
    } catch (error: any) {
      toast.error(error?.message || "Test send failed");
    } finally {
      setTesting(false);
    }
  };

  const quality = String(context?.qualityRating || "UNKNOWN");
  const qualityClass =
    quality === "HIGH"
      ? "bg-emerald-100 text-emerald-700"
      : quality === "MEDIUM"
        ? "bg-amber-100 text-amber-800"
        : "bg-slate-100 text-slate-700";

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="w-7xl max-w-[calc(100%-2rem)] sm:max-w-7xl max-h-[90vh] overflow-y-auto p-0">
        <FeatureGate feature={FEATURE.WHATSAPP_MESSAGING} loaderClassName="h-32 w-full!">
          <div className="bg-sky-50 px-6 py-3 text-xs grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <p className="text-muted-foreground">Quality Rating</p>
              <span className={`inline-flex mt-1 rounded-full px-2 py-0.5 font-medium ${qualityClass}`}>
                {quality}
              </span>
            </div>
            <div>
              <p className="text-muted-foreground">Template Messaging Tier</p>
              <p className="mt-1 font-medium">{context?.messagingLimitLabel || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Remaining Quota</p>
              <p className="mt-1 font-medium">{context?.remainingQuota ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Selected Audience</p>
              <p className="mt-1 font-medium">{preview?.selected ?? selectedCount}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Final Audience</p>
              <p className="mt-1 font-medium">{preview?.finalAudience ?? preview?.eligible ?? "—"}</p>
            </div>
          </div>

          <div className="px-6 py-4 space-y-5">
            <DialogHeader>
              <DialogTitle>Create Campaign</DialogTitle>
            </DialogHeader>

            <div className="space-y-2">
              <Label>Campaign name</Label>
              <Input
                value={form.name}
                placeholder={selectedTemplate?.name || "WhatsApp campaign"}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Marketing template</Label>
                <Link className="text-xs text-primary" to={WHATSAPP_PATHS.getTemplates(accountId)}>
                  Manage templates
                </Link>
              </div>
              <Select
                value={form.templateId || undefined}
                onValueChange={(templateId) => setForm({ ...form, templateId })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an approved marketing template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem
                      key={String(template.id || template._id)}
                      value={String(template.id || template._id)}
                    >
                      {template.name} ({template.language})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!templates.length && (
                <p className="text-xs text-muted-foreground">
                  No approved MARKETING templates yet.
                </p>
              )}
              {selectedTemplate?.components?.[0]?.text && (
                <p className="text-sm rounded-md border bg-muted/40 p-3">
                  {selectedTemplate.components[0].text}
                </p>
              )}
            </div>

            <div className="flex items-start justify-between gap-4 rounded-xl border p-4">
              <div>
                <p className="font-medium">Schedule Date and Time</p>
                <p className="text-sm text-muted-foreground">
                  Schedule campaign upto two month from today.
                </p>
              </div>
              <Switch checked={scheduleEnabled} onCheckedChange={setScheduleEnabled} />
            </div>
            {scheduleEnabled && (
              <Input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              />
            )}

            <div className="flex items-start justify-between gap-4 rounded-xl border p-4">
              <div>
                <p className="font-medium">Exclude Opted-out data</p>
                <p className="text-sm text-muted-foreground">
                  Skip users who have opted out from future campaign.
                </p>
              </div>
              <Switch checked={excludeOptedOut} onCheckedChange={setExcludeOptedOut} />
            </div>

            <div className="rounded-xl border p-4 space-y-3">
              <p className="font-medium">Test Campaign</p>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_140px_1fr_auto] gap-2">
                <Input
                  placeholder="Username"
                  value={form.testName}
                  onChange={(e) => setForm({ ...form, testName: e.target.value })}
                />
                <CountryCodeSelect
                  value={form.testCountry}
                  onChange={(value) => setForm({ ...form, testCountry: value })}
                />
                <Input
                  placeholder="WhatsApp Number"
                  value={form.testPhone}
                  onChange={(e) => setForm({ ...form, testPhone: e.target.value })}
                />
                <Button type="button" variant="outline" disabled={testing} onClick={() => void sendTest()}>
                  <Send className="h-4 w-4" />
                  Test
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">Estimated Cost</p>
                <p className="text-xl font-semibold">₹0.00</p>
              </div>
              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">Remaining quota</p>
                <p className="text-xl font-semibold">{context?.remainingQuota ?? 0}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-2">
              <button type="button" className="text-sm text-muted-foreground" onClick={onClose}>
                Cancel
              </button>
              <Button disabled={saving || !form.templateId} onClick={() => void launch()}>
                {scheduleEnabled ? "SCHEDULE" : "SEND NOW"}
              </Button>
            </div>
            {saving && <DataLoader className="h-12" />}
          </div>
        </FeatureGate>
      </DialogContent>
    </Dialog>
  );
}
