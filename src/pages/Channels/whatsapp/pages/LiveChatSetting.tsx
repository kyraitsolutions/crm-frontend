import { useEffect, useState } from "react";
import CampaignOptout from "../components/optin/CampaignOptout";
import MessageConfig from "../components/cards/MessageConfig";
import WorkingHours from "../components/workinghours/WorkingHours";
import AutoResolveConfigureDialog from "../components/live-chat/AutoResolveConfigureDialog";
import AutoReplyConfigureDialog from "../components/live-chat/AutoReplyConfigureDialog";
import { useAuthStore } from "@/stores";
import { ToastMessageService } from "@/services";
import { whatsappLiveChatService } from "../services/whatsapp-live-chat.service";
import { defaultSchedule } from "../utils/defaultSchedule";
import type {
  AutoReplyConfig,
  AutoResolveConfig,
  LiveChatFlowOption,
  LiveChatTemplateOption,
  WhatsAppLiveChatSettings,
} from "../types/live-chat.type";
import DataLoader from "@/components/Loader/data-loader";
// import { Link } from "react-router-dom";
// import { Bot } from "lucide-react";
import {
  autoResolveCoversOffHours,
  autoResolveCoversWelcome,
  autoResolveScheduleCopy,
  offHoursLockReason,
  welcomeLockReason,
} from "../utils/autoResolveWindows";
import { Button } from "@/components/ui/button";

const defaultAutoResolve: AutoResolveConfig = {
  enabled: false,
  mode: null,
  chatFlowId: null,
  aiAgentId: null,
  scheduleMode: "working_hours",
};

const defaultWelcome: AutoReplyConfig = {
  enabled: false,
  type: "text",
  text: "Hi! Thanks for connecting. Someone from our team will get in touch soon.",
};

const defaultOffHours: AutoReplyConfig = {
  enabled: false,
  type: "text",
  text: "Hi! Thanks for connecting. Our team is unavailable right now. We'll be back during working hours.",
};

const previewText = (reply: AutoReplyConfig) => {
  if (reply.type === "template") {
    return reply.templateName
      ? `Template: ${reply.templateName}`
      : "No template selected";
  }
  return reply.text || "No message configured";
};

const SectionCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}
  >
    {children}
  </section>
);

const LiveChatSetting = () => {
  const { accountId } = useAuthStore();
  const toast = new ToastMessageService();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoResolve, setAutoResolve] =
    useState<AutoResolveConfig>(defaultAutoResolve);
  const [welcomeMessage, setWelcomeMessage] =
    useState<AutoReplyConfig>(defaultWelcome);
  const [offHoursMessage, setOffHoursMessage] =
    useState<AutoReplyConfig>(defaultOffHours);
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [flows, setFlows] = useState<LiveChatFlowOption[]>([]);
  const [templates, setTemplates] = useState<LiveChatTemplateOption[]>([]);
  const [aiAgent, setAiAgent] = useState({
    configured: false,
    id: null as string | null,
    available: false,
  });
  const [resolveOpen, setResolveOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [offHoursOpen, setOffHoursOpen] = useState(false);

  useEffect(() => {
    if (!accountId) return;
    void whatsappLiveChatService
      .getContext(String(accountId))
      .then((response) => {
        const doc = response.data?.doc;
        if (!doc) return;
        const settings = doc.settings;
        setAutoResolve({ ...defaultAutoResolve, ...settings.autoResolve });
        setWelcomeMessage({ ...defaultWelcome, ...settings.welcomeMessage });
        setOffHoursMessage({ ...defaultOffHours, ...settings.offHoursMessage });
        setTimezone(settings.workingHours?.timezone || "Asia/Kolkata");
        setSchedule(
          settings.workingHours?.days?.length
            ? settings.workingHours.days
            : defaultSchedule,
        );
        setFlows(doc.flows || []);
        setTemplates(doc.templates || []);
        setAiAgent(
          doc.aiAgent || { configured: false, id: null, available: false },
        );
      })
      .catch(() => toast.error("Could not load live chat settings"))
      .finally(() => setLoading(false));
  }, [accountId]);

  const persist = async (payload: Partial<WhatsAppLiveChatSettings>) => {
    if (!accountId) return false;
    setSaving(true);
    try {
      const response = await whatsappLiveChatService.updateSettings(
        String(accountId),
        payload,
      );
      const doc = response.data?.doc;
      if (doc?.autoResolve)
        setAutoResolve({ ...defaultAutoResolve, ...doc.autoResolve });
      if (doc?.welcomeMessage) {
        setWelcomeMessage({ ...defaultWelcome, ...doc.welcomeMessage });
      }
      if (doc?.offHoursMessage) {
        setOffHoursMessage({ ...defaultOffHours, ...doc.offHoursMessage });
      }
      if (doc?.workingHours?.timezone) setTimezone(doc.workingHours.timezone);
      if (doc?.workingHours?.days?.length) setSchedule(doc.workingHours.days);
      toast.success("Settings saved");
      return true;
    } catch (error: any) {
      toast.error(error?.message || "Could not save settings");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const canEnableAutoResolve = (value: AutoResolveConfig) => {
    if (value.mode === "flow") return Boolean(value.chatFlowId);
    if (value.mode === "ai_agent") return aiAgent.available || aiAgent.configured;
    return false;
  };

  const handleAutoResolveToggle = (enabled: boolean) => {
    if (enabled && !canEnableAutoResolve(autoResolve)) {
      setResolveOpen(true);
      return;
    }
    const next = { ...autoResolve, enabled };
    setAutoResolve(next);
    if (autoResolveCoversWelcome(next)) {
      setWelcomeMessage((prev) => ({ ...prev, enabled: false }));
    }
    if (autoResolveCoversOffHours(next)) {
      setOffHoursMessage((prev) => ({ ...prev, enabled: false }));
    }
    void persist(buildAutoResolvePayload(next));
  };

  const buildAutoResolvePayload = (
    next: AutoResolveConfig,
  ): Partial<WhatsAppLiveChatSettings> => {
    const payload: Partial<WhatsAppLiveChatSettings> = { autoResolve: next };
    if (autoResolveCoversWelcome(next)) {
      payload.welcomeMessage = { ...welcomeMessage, enabled: false };
    }
    if (autoResolveCoversOffHours(next)) {
      payload.offHoursMessage = { ...offHoursMessage, enabled: false };
    }
    return payload;
  };

  const welcomeLocked = autoResolveCoversWelcome(autoResolve);
  const offHoursLocked = autoResolveCoversOffHours(autoResolve);

  useEffect(() => {
    if (welcomeLocked) setWelcomeOpen(false);
    if (offHoursLocked) setOffHoursOpen(false);
  }, [welcomeLocked, offHoursLocked]);

  if (loading) return <DataLoader className="h-[calc(100vh-180px)]" />;

  const resolverLabel =
    autoResolve.mode === "flow"
      ? "Chatflow"
      : autoResolve.mode === "ai_agent"
        ? "AI agent"
        : "Not configured";

  const scheduleLabel =
    autoResolve.scheduleMode === "working_hours"
      ? "During working hours"
      : autoResolve.scheduleMode === "off_hours"
        ? "Outside working hours"
        : autoResolve.scheduleMode === "always"
          ? "Always"
          : "—";

  return (
    <div className="w-full space-y-4">
      <header className="space-y-1 px-1">
        <h1 className="text-lg font-semibold text-gray-900">
          Live Chat Settings
        </h1>
        <p className="text-sm text-gray-500">
          Control how WhatsApp chats are auto-resolved and how customers get
          replies during and outside working hours.
        </p>
      </header>

      {/* Auto Resolve */}
      <SectionCard>
        <div className="border-b border-gray-100 px-5 py-4">
          <CampaignOptout
            bare
            title="Auto Resolve Chats"
            description="Let a published chatflow or AI agent handle WhatsApp chats. Intervened chats stay with your team."
            enabled={autoResolve.enabled}
            onChange={handleAutoResolveToggle}
          />
        </div>

        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                Resolver: {resolverLabel}
              </span>
              <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800">
                {scheduleLabel}
              </span>
            </div>
            {autoResolve.enabled ? (
              <p className="text-xs text-gray-500">
                {autoResolveScheduleCopy(autoResolve.scheduleMode)}
              </p>
            ) : (
              <p className="text-xs text-gray-400">
                Turn on auto resolve, then configure a chatflow or AI agent.
              </p>
            )}
          </div>
          <Button
            type="button"
            onClick={() => setResolveOpen(true)}
            className="actions-btn rounded-xl!"
          >
            Configure
          </Button>
        </div>
      </SectionCard>

      {/* AI Sales Agent — commented out with sidebar
      <SectionCard className="px-5 py-4">
        <Link
          to="/dashboard/settings/whatsapp/ai-agent"
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bot size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                AI Sales Agent
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Configure instructions, knowledge base, qualification fields,
                scoring and escalation for WhatsApp conversations.
              </p>
            </div>
          </div>
          <span className="rounded-xl border border-teal-800 px-3 py-1.5 text-xs text-teal-800">
            Open
          </span>
        </Link>
      </SectionCard>
      */}

      {/* Auto replies */}
      <SectionCard>
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">Auto replies</h2>
          <p className="mt-1 text-sm text-gray-500">
            First-message replies when auto resolve is not covering that window.
          </p>
        </div>

        <div className="grid gap-4 p-4 md:grid-cols-2 md:gap-0 md:divide-x md:divide-gray-100">
          <div className="md:pr-4">
            <MessageConfig
              responseTitle="Welcome Message"
              responseDescription="Sent on the first query during working hours when auto resolve is not covering that window."
              message={previewText(welcomeMessage)}
              autoResponseEnabled={welcomeMessage.enabled && !welcomeLocked}
              locked={welcomeLocked}
              lockReason={welcomeLockReason(autoResolve)}
              onToggle={(enabled) => {
                if (welcomeLocked) return;
                const next = { ...welcomeMessage, enabled };
                setWelcomeMessage(next);
                if (enabled && next.type === "text" && !next.text) {
                  setWelcomeOpen(true);
                  return;
                }
                void persist({ welcomeMessage: next });
              }}
              onConfigure={() => {
                if (welcomeLocked) return;
                setWelcomeOpen(true);
              }}
            />
          </div>
          <div className="md:pl-4">
            <MessageConfig
              responseTitle="Off Hours Message"
              responseDescription="Sent on the first query outside working hours when auto resolve is not covering that window."
              message={previewText(offHoursMessage)}
              autoResponseEnabled={offHoursMessage.enabled && !offHoursLocked}
              locked={offHoursLocked}
              lockReason={offHoursLockReason(autoResolve)}
              onToggle={(enabled) => {
                if (offHoursLocked) return;
                const next = { ...offHoursMessage, enabled };
                setOffHoursMessage(next);
                if (enabled && next.type === "text" && !next.text) {
                  setOffHoursOpen(true);
                  return;
                }
                void persist({ offHoursMessage: next });
              }}
              onConfigure={() => {
                if (offHoursLocked) return;
                setOffHoursOpen(true);
              }}
            />
          </div>
        </div>
      </SectionCard>

      {/* Working hours */}
      <SectionCard className="p-5">
        <WorkingHours
          timezone={timezone}
          schedule={schedule}
          saving={saving}
          onTimezoneChange={setTimezone}
          onScheduleChange={setSchedule}
          onSave={() =>
            void persist({
              workingHours: { timezone, days: schedule },
            })
          }
        />
      </SectionCard>

      <AutoResolveConfigureDialog
        open={resolveOpen}
        saving={saving}
        value={autoResolve}
        flows={flows}
        aiAgent={aiAgent}
        onClose={() => setResolveOpen(false)}
        onSave={(next) => {
          setAutoResolve(next);
          if (autoResolveCoversWelcome(next)) {
            setWelcomeMessage((prev) => ({ ...prev, enabled: false }));
          }
          if (autoResolveCoversOffHours(next)) {
            setOffHoursMessage((prev) => ({ ...prev, enabled: false }));
          }
          void persist(buildAutoResolvePayload(next)).then((ok) => {
            if (ok) setResolveOpen(false);
          });
        }}
      />

      <AutoReplyConfigureDialog
        open={welcomeOpen}
        title="Welcome message"
        description="This reply is sent on the customer's first message during working hours."
        saving={saving}
        value={welcomeMessage}
        templates={templates}
        onChange={setWelcomeMessage}
        onClose={() => setWelcomeOpen(false)}
        onSave={() =>
          void persist({
            welcomeMessage: { ...welcomeMessage, enabled: true },
          }).then((ok) => {
            if (ok) setWelcomeOpen(false);
          })
        }
      />

      <AutoReplyConfigureDialog
        open={offHoursOpen}
        title="Off hours message"
        description="This reply is sent on the customer's first message outside working hours."
        saving={saving}
        value={offHoursMessage}
        templates={templates}
        onChange={setOffHoursMessage}
        onClose={() => setOffHoursOpen(false)}
        onSave={() =>
          void persist({
            offHoursMessage: { ...offHoursMessage, enabled: true },
          }).then((ok) => {
            if (ok) setOffHoursOpen(false);
          })
        }
      />
    </div>
  );
};

export default LiveChatSetting;
