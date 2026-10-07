import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Mail,
  MessageCircle,
  Plus,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataLoader from "@/components/Loader/data-loader";
import { useAuthStore } from "@/stores";
import { useAccountAccessStore } from "@/stores/account-access.store";
import { ROLES } from "@/rbac";
import { ToastMessageService } from "@/services";
import { TeamService } from "@/services/team.service";
import { whatsappTemplateService } from "@/pages/Channels/whatsapp/services/whatsapp-template.service";
import type { ITeam } from "@/types/teams.type";
import {
  notificationSettingsService,
  type StaffAlertConfig,
} from "./services/notification-settings.service";

const toast = new ToastMessageService();
const teamService = new TeamService();

const SOURCE_OPTIONS = [
  { value: "meta_ads", label: "Meta / Facebook ads" },
  { value: "google_ads", label: "Google ads" },
  { value: "website_form", label: "Website form" },
  { value: "chatbot", label: "Chatbot" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
  { value: "manual", label: "Manual" },
  { value: "import", label: "Import" },
  { value: "api", label: "API" },
];

const emptyConfig = (accountId: string): StaffAlertConfig => ({
  organizationId: "",
  accountId,
  enabled: true,
  channels: { in_app: true, email: true, whatsapp: false },
  recipientUserIds: [],
  events: { lead_created: true },
  whatsapp: { defaultTemplateId: null, bySource: [] },
});

const NotificationSettingPage = () => {
  const { accountId, user } = useAuthStore();
  const accountRole = useAccountAccessStore((state) => state.role);
  const roleName = String(accountRole || user?.role?.name || "").toUpperCase();
  const canEdit = roleName === ROLES.OWNER;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<StaffAlertConfig | null>(null);
  const [members, setMembers] = useState<ITeam[]>([]);
  const [templates, setTemplates] = useState<
    Array<{ id: string; name: string; language?: string }>
  >([]);

  const load = useCallback(async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      const [alertRes, teamRes, templateRes] = await Promise.all([
        notificationSettingsService.getStaffAlerts(String(accountId)),
        teamService.getTeamMembers(),
        whatsappTemplateService
          .getTemplates(String(accountId), {
            status: "APPROVED",
            page: 1,
            limit: 100,
          })
          .catch(() => null),
      ]);

      const alertData = alertRes?.data as
        | { config?: StaffAlertConfig }
        | undefined;
      setConfig(alertData?.config || emptyConfig(String(accountId)));

      const teamPayload = teamRes?.data as
        | { docs?: ITeam[] }
        | ITeam[]
        | undefined;
      const teamDocs = Array.isArray(teamPayload)
        ? teamPayload
        : Array.isArray(teamPayload?.docs)
          ? teamPayload.docs
          : [];
      setMembers(teamDocs);

      const templateDocs =
        (templateRes as any)?.data?.docs ||
        (templateRes as any)?.data?.templates ||
        (templateRes as any)?.data ||
        [];
      setTemplates(
        (Array.isArray(templateDocs) ? templateDocs : []).map((t: any) => ({
          id: String(t.id || t._id),
          name: String(t.name || "template"),
          language: t.language,
        })),
      );
    } catch (error: any) {
      toast.error(error?.message || "Failed to load alert settings");
      setConfig(emptyConfig(String(accountId)));
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (next: StaffAlertConfig) => {
    if (!accountId || !canEdit) return;
    setSaving(true);
    setConfig(next);
    try {
      const res = await notificationSettingsService.updateStaffAlerts({
        ...next,
        accountId: String(accountId),
      });
      const saved = (res?.data as { config?: StaffAlertConfig } | undefined)
        ?.config;
      if (saved) setConfig(saved);
      toast.success("Saved");
    } catch (error: any) {
      toast.error(error?.message || "Failed to save");
      void load();
    } finally {
      setSaving(false);
    }
  };

  const toggleRecipient = (userId: string, checked: boolean) => {
    if (!config || !canEdit) return;
    const set = new Set(config.recipientUserIds);
    if (checked) set.add(userId);
    else set.delete(userId);
    void save({ ...config, recipientUserIds: [...set] });
  };

  const membersWithoutPhone = members.filter(
    (m) =>
      config?.recipientUserIds.includes(m.userId || m.id) &&
      !String(m.userProfile?.phone || "").trim(),
  );

  if (loading || !config) {
    return (
      <div className="bg-linear-to-b from-green-50 to-orange-50 min-h-screen py-16">
        <DataLoader />
      </div>
    );
  }

  const controlsDisabled = !canEdit || !config.enabled;

  return (
    <div className="bg-linear-to-b from-green-50 to-orange-50 min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Team alerts
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              When a lead comes in, alert your team on Bell, Email, and/or
              WhatsApp (using your Business number + template).
            </p>
          </div>
          {saving && canEdit && (
            <span className="text-xs rounded-full bg-white border px-3 py-1">
              Saving…
            </span>
          )}
        </div>

        {!canEdit && (
          <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Only the account owner can change team alert settings. You can view
            the current configuration.
          </div>
        )}

        {/* Master */}
        <section className="rounded-xl border bg-white p-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-gray-800">Alert team on new leads</p>
            <p className="text-sm text-gray-500">
              Turn this off to stop all staff alerts for new leads.
            </p>
          </div>
          <Switch
            checked={config.enabled && config.events.lead_created}
            disabled={!canEdit}
            onCheckedChange={(checked) =>
              void save({
                ...config,
                enabled: checked,
                events: { ...config.events, lead_created: checked },
              })
            }
          />
        </section>

        {/* Channels */}
        <section className="rounded-xl border bg-white p-4 space-y-3">
          <div>
            <h2 className="font-semibold text-gray-800">
              1. How should we notify them?
            </h2>
            <p className="text-sm text-gray-500">
              Pick one or more. WhatsApp uses your connected WhatsApp Business
              account.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <ChannelToggle
              icon={<Bell className="w-4 h-4 text-primary" />}
              title="Bell in Kyra"
              subtitle="Right sidebar"
              checked={config.channels.in_app}
              disabled={controlsDisabled}
              onChange={(checked) =>
                void save({
                  ...config,
                  channels: { ...config.channels, in_app: checked },
                })
              }
            />
            <ChannelToggle
              icon={<Mail className="w-4 h-4 text-orange-600" />}
              title="Email"
              subtitle="User login email"
              checked={config.channels.email}
              disabled={controlsDisabled}
              onChange={(checked) =>
                void save({
                  ...config,
                  channels: { ...config.channels, email: checked },
                })
              }
            />
            <ChannelToggle
              icon={<MessageCircle className="w-4 h-4 text-emerald-600" />}
              title="WhatsApp"
              subtitle="To team phones"
              checked={config.channels.whatsapp}
              disabled={controlsDisabled}
              onChange={(checked) =>
                void save({
                  ...config,
                  channels: { ...config.channels, whatsapp: checked },
                })
              }
            />
          </div>
        </section>

        {/* Who */}
        <section className="rounded-xl border bg-white p-4 space-y-3">
          <div>
            <h2 className="font-semibold text-gray-800">
              2. Who should get the alert?
            </h2>
            <p className="text-sm text-gray-500">
              Leave everyone unchecked to notify all account members. For
              WhatsApp, each person needs a phone number on their profile.
            </p>
          </div>

          <div className="rounded-lg border divide-y max-h-72 overflow-y-auto">
            {members.length === 0 ? (
              <p className="text-sm text-gray-500 p-3">No team members found.</p>
            ) : (
              members.map((member) => {
                const userId = member.userId || member.id;
                const checked = config.recipientUserIds.includes(userId);
                const name =
                  `${member.userProfile?.firstName || ""} ${member.userProfile?.lastName || ""}`.trim() ||
                  member.email;
                const phone = member.userProfile?.phone || "No phone";
                return (
                  <label
                    key={userId}
                    className={`flex items-center gap-3 px-3 py-2.5 ${
                      canEdit
                        ? "cursor-pointer hover:bg-gray-50"
                        : "cursor-default opacity-80"
                    }`}
                  >
                    <Checkbox
                      checked={checked}
                      disabled={controlsDisabled}
                      onCheckedChange={(value) =>
                        toggleRecipient(userId, Boolean(value))
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {member.email} · {phone}
                      </p>
                    </div>
                  </label>
                );
              })
            )}
          </div>
          {config.recipientUserIds.length === 0 && (
            <p className="text-xs text-primary">
              No one selected → all account members will be notified.
            </p>
          )}
        </section>

        {/* WhatsApp templates */}
        <section className="rounded-xl border bg-white p-4 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-gray-800">
                3. WhatsApp template for team alerts
              </h2>
              <p className="text-sm text-gray-500">
                Sent from your WhatsApp Business number to each selected
                teammate’s phone.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" disabled={!canEdit}>
              <Link
                to="/dashboard/settings/whatsapp/template-messages"
                className={!canEdit ? "pointer-events-none opacity-50" : undefined}
              >
                Templates
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          {!config.channels.whatsapp && (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              Turn on the WhatsApp channel above to use templates.
            </p>
          )}

          <div className="space-y-1 max-w-md">
            <Label className="text-xs text-gray-500">
              Default template (all sources)
            </Label>
            <Select
              value={config.whatsapp.defaultTemplateId || "none"}
              disabled={
                controlsDisabled || !config.channels.whatsapp
              }
              onValueChange={(value) =>
                void save({
                  ...config,
                  whatsapp: {
                    ...config.whatsapp,
                    defaultTemplateId: value === "none" ? null : value,
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select approved template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No template</SelectItem>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                    {t.language ? ` (${t.language})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {templates.length === 0 && (
              <p className="text-xs text-gray-500">
                No approved templates yet. Create one under WhatsApp → Template
                messages.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Different template by lead source
                </p>
                <p className="text-xs text-gray-500">
                  e.g. Meta leads → Template A, Website → Template B
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={
                  controlsDisabled || !config.channels.whatsapp
                }
                onClick={() =>
                  void save({
                    ...config,
                    whatsapp: {
                      ...config.whatsapp,
                      bySource: [
                        ...config.whatsapp.bySource,
                        { source: "meta_ads", templateId: templates[0]?.id || "" },
                      ],
                    },
                  })
                }
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add rule
              </Button>
            </div>

            {config.whatsapp.bySource.map((row, index) => (
              <div
                key={`${row.source}-${index}`}
                className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 items-end"
              >
                <div>
                  <Label className="text-xs text-gray-500">Source</Label>
                  <Select
                    value={row.source}
                    disabled={
                      controlsDisabled || !config.channels.whatsapp
                    }
                    onValueChange={(value) => {
                      const bySource = [...config.whatsapp.bySource];
                      bySource[index] = { ...row, source: value };
                      void save({
                        ...config,
                        whatsapp: { ...config.whatsapp, bySource },
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SOURCE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Template</Label>
                  <Select
                    value={row.templateId || "none"}
                    disabled={
                      controlsDisabled || !config.channels.whatsapp
                    }
                    onValueChange={(value) => {
                      const bySource = [...config.whatsapp.bySource];
                      bySource[index] = {
                        ...row,
                        templateId: value === "none" ? "" : value,
                      };
                      void save({
                        ...config,
                        whatsapp: { ...config.whatsapp, bySource },
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select template</SelectItem>
                      {templates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={
                    controlsDisabled || !config.channels.whatsapp
                  }
                  onClick={() => {
                    const bySource = config.whatsapp.bySource.filter(
                      (_, i) => i !== index,
                    );
                    void save({
                      ...config,
                      whatsapp: { ...config.whatsapp, bySource },
                    });
                  }}
                >
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
            ))}
          </div>

          {config.channels.whatsapp && membersWithoutPhone.length > 0 && (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              These selected people have no phone on their profile, so WhatsApp
              alert will skip them:{" "}
              {membersWithoutPhone
                .map((m) => m.userProfile?.firstName || m.email)
                .join(", ")}
            </p>
          )}
        </section>

        <section className="rounded-xl border border-dashed bg-white/70 p-4 text-sm text-gray-600">
          <p className="font-medium text-gray-800 mb-1">Quick example</p>
          <p>
            Lead from Meta → Bell + Email + WhatsApp Template A to Sales team.
            Lead from Website → same people, but WhatsApp Template B.
          </p>
        </section>
      </div>
    </div>
  );
};

function ChannelToggle({
  icon,
  title,
  subtitle,
  checked,
  disabled,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="rounded-lg border p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {icon}
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{title}</p>
            <p className="text-xs text-gray-500 truncate">{subtitle}</p>
          </div>
        </div>
        <Switch
          checked={checked}
          disabled={disabled}
          onCheckedChange={onChange}
        />
      </div>
    </div>
  );
}

export default NotificationSettingPage;
