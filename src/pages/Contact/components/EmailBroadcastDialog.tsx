import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { EMAIL_MARKETING_PATHS } from "@/constants/routes";
import { FEATURE } from "@/constants/subscription.constant";
import { FeatureGate } from "@/components/subscription/FeatureGate";
import DataLoader from "@/components/Loader/data-loader";
import { ToastMessageService } from "@/services";
import { CreateTemplateDialog } from "@/pages/EmailMarketing/components/CreateTemplateDialog";
import { emailMarketingService } from "@/pages/EmailMarketing/services/email-marketing.service";
import { useEmailMarketingStore } from "@/pages/EmailMarketing/store/email-marketing.store";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type EmailBroadcastDialogProps = {
  open: boolean;
  accountId: string;
  contactIds: string[];
  selectAllMatching: boolean;
  audienceFilters: Record<string, string>;
  onClose: () => void;
};

export function EmailBroadcastDialog({
  open,
  accountId,
  contactIds,
  selectAllMatching,
  audienceFilters,
  onClose,
}: EmailBroadcastDialogProps) {
  const navigate = useNavigate();
  const toast = new ToastMessageService();
  const { templates, fetchTemplates, loading } = useEmailMarketingStore();
  const [preview, setPreview] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [createTemplateOpen, setCreateTemplateOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    fromName: "Kyra CRM",
    fromEmail: "",
    replyTo: "",
    templateId: "",
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
    if (open && accountId) void fetchTemplates(accountId);
  }, [open, accountId, fetchTemplates]);

  useEffect(() => {
    if (!open || !accountId) return;
    void emailMarketingService
      .previewAudience(accountId, audience)
      .then((res) => setPreview(res.data?.doc))
      .catch(() => undefined);
  }, [open, accountId, selectAllMatching, contactIdKey, filterKey]);

  const send = async () => {
    if (!form.templateId) {
      toast.error("Select a template before sending");
      return;
    }
    try {
      setSaving(true);
      const created = await emailMarketingService.createCampaign(accountId, {
        name: form.name || selectedTemplate?.name || "Contact broadcast",
        fromName: form.fromName,
        fromEmail: form.fromEmail,
        replyTo: form.replyTo,
        templateId: form.templateId,
        audience,
      });
      const campaign = created.data?.doc;
      await emailMarketingService.sendNow(accountId, campaign.id);
      toast.success("Campaign queued for sending");
      onClose();
      navigate(EMAIL_MARKETING_PATHS.campaign(accountId, campaign.id));
    } catch (error: any) {
      toast.error(error?.message || "Could not send broadcast");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <FeatureGate feature={FEATURE.EMAIL_MARKETING} loaderClassName="h-32">
            <DialogHeader>
              <DialogTitle>Email broadcast</DialogTitle>
              <DialogDescription>
                Choose a saved template to send to the selected contacts.
              </DialogDescription>
            </DialogHeader>
            {loading && templates.length === 0 ? (
              <DataLoader className="h-32" />
            ) : (
              <div className="space-y-4">
                {preview && (
                  <p className="text-sm rounded border p-3">
                    Contacts with email: {preview.audience} · Eligible: {preview.eligible} ·
                    Excluded: {preview.excluded}
                  </p>
                )}
                <div className="space-y-2">
                  <Label>Campaign name</Label>
                  <Input
                    value={form.name}
                    placeholder={selectedTemplate?.name || "Contact broadcast"}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Template</Label>
                    <button
                      type="button"
                      className="text-xs text-primary"
                      onClick={() => setCreateTemplateOpen(true)}
                    >
                      Create template
                    </button>
                  </div>
                  <Select
                    value={form.templateId || undefined}
                    onValueChange={(templateId) => setForm({ ...form, templateId })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem
                          key={String(template.id || template._id)}
                          value={String(template.id || template._id)}
                        >
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!templates.length && (
                    <p className="text-xs text-muted-foreground">
                      No templates yet.{" "}
                      <Link className="text-primary" to={EMAIL_MARKETING_PATHS.templates(accountId)}>
                        Open templates
                      </Link>
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>From name</Label>
                  <Input
                    value={form.fromName}
                    onChange={(e) => setForm({ ...form, fromName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>From email</Label>
                  <Input
                    value={form.fromEmail}
                    onChange={(e) => setForm({ ...form, fromEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reply-to</Label>
                  <Input
                    value={form.replyTo}
                    onChange={(e) => setForm({ ...form, replyTo: e.target.value })}
                  />
                </div>
                {selectedTemplate && (
                  <div className="border rounded bg-white p-3 max-h-40 overflow-auto">
                    <p className="text-xs text-muted-foreground">{selectedTemplate.subject}</p>
                    <div dangerouslySetInnerHTML={{ __html: selectedTemplate.html }} />
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={saving || !form.templateId} onClick={() => void send()}>
                Send now
              </Button>
            </DialogFooter>
            {saving && <DataLoader className="h-16" />}
          </FeatureGate>
        </DialogContent>
      </Dialog>
      <CreateTemplateDialog
        open={createTemplateOpen}
        onClose={() => setCreateTemplateOpen(false)}
        accountId={accountId}
        onCreated={() => {
          setCreateTemplateOpen(false);
          void fetchTemplates(accountId);
        }}
      />
    </>
  );
}
