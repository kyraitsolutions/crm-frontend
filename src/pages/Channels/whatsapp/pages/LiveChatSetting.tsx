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

const LiveChatSetting = () => {
  const { accountId } = useAuthStore();
  const toast = new ToastMessageService();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoResolve, setAutoResolve] = useState<AutoResolveConfig>(defaultAutoResolve);
  const [welcomeMessage, setWelcomeMessage] = useState<AutoReplyConfig>(defaultWelcome);
  const [offHoursMessage, setOffHoursMessage] = useState<AutoReplyConfig>(defaultOffHours);
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
        setAiAgent(doc.aiAgent || { configured: false, id: null, available: false });
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
      if (doc?.autoResolve) setAutoResolve({ ...defaultAutoResolve, ...doc.autoResolve });
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
    setAutoResolve((prev) => ({ ...prev, enabled }));
    void persist({ autoResolve: { ...autoResolve, enabled } });
  };

  if (loading) return <DataLoader className="h-[calc(100vh-180px)]" />;

  return (
    <div className="max-w-7xl space-y-8 mx-auto py-10">
      <CampaignOptout
        title="Auto Resolve Chats"
        description="Let a published chatflow or AI agent handle WhatsApp chats. Intervened chats stay with your team."
        enabled={autoResolve.enabled}
        onChange={handleAutoResolveToggle}
      />

      <div className="flex items-center justify-between rounded-2xl bg-white px-10 py-4 -mt-4">
        <p className="text-sm text-gray-500">
          {autoResolve.mode === "flow"
            ? "Resolver: Chatflow"
            : autoResolve.mode === "ai_agent"
              ? "Resolver: AI agent"
              : "No resolver configured yet"}
          {autoResolve.scheduleMode === "working_hours"
            ? " · Runs during working hours"
            : autoResolve.scheduleMode === "off_hours"
              ? " · Runs outside working hours"
              : autoResolve.scheduleMode === "always"
                ? " · Runs always"
                : ""}
        </p>
        <button
          onClick={() => setResolveOpen(true)}
          className="text-sm text-teal-800 underline"
        >
          Configure
        </button>
      </div>

      <div className="flex gap-10 bg-white p-10 rounded-2xl">
        <MessageConfig
          responseTitle="Welcome Message"
          responseDescription="Sent on the first query during working hours when auto resolve is not active"
          message={previewText(welcomeMessage)}
          autoResponseEnabled={welcomeMessage.enabled}
          onToggle={(enabled) => {
            const next = { ...welcomeMessage, enabled };
            setWelcomeMessage(next);
            if (enabled && next.type === "text" && !next.text) {
              setWelcomeOpen(true);
              return;
            }
            void persist({ welcomeMessage: next });
          }}
          onConfigure={() => setWelcomeOpen(true)}
        />
        <div className="h-auto w-px bg-gray-200" />
        <MessageConfig
          responseTitle="Off Hours Message"
          responseDescription="Sent on the first query outside working hours when auto resolve is not active"
          message={previewText(offHoursMessage)}
          autoResponseEnabled={offHoursMessage.enabled}
          onToggle={(enabled) => {
            const next = { ...offHoursMessage, enabled };
            setOffHoursMessage(next);
            if (enabled && next.type === "text" && !next.text) {
              setOffHoursOpen(true);
              return;
            }
            void persist({ offHoursMessage: next });
          }}
          onConfigure={() => setOffHoursOpen(true)}
        />
      </div>

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

      <AutoResolveConfigureDialog
        open={resolveOpen}
        saving={saving}
        value={autoResolve}
        flows={flows}
        aiAgent={aiAgent}
        onClose={() => setResolveOpen(false)}
        onSave={(next) => {
          setAutoResolve(next);
          void persist({ autoResolve: next }).then((ok) => {
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
