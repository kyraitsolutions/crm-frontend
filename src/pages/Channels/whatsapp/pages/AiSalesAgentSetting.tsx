import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FeatureGate } from "@/components/subscription/FeatureGate";
import { FEATURE } from "@/constants/subscription.constant";
import DataLoader from "@/components/Loader/data-loader";
import { ToastMessageService } from "@/services";
import { useAuthStore } from "@/stores";
import { whatsappAiAgentService } from "../services/whatsapp-ai-agent.service";
import type {
  KnowledgeArticle,
  QualificationField,
  WhatsAppAiAgentConfig,
} from "../types/ai-agent.type";

const emptyConfig = (): WhatsAppAiAgentConfig => ({
  enabled: true,
  instructions: "",
  businessProfile: { name: "", industry: "", description: "", timezone: "Asia/Kolkata" },
  qualificationFields: [],
  intents: [],
  scoring: {
    weights: {
      requiredFieldsFilled: 40,
      highIntent: 20,
      timeline: 15,
      budget: 15,
      engagement: 10,
    },
    levels: [
      { min: 0, max: 30, level: "LOW" },
      { min: 31, max: 60, level: "WARM" },
      { min: 61, max: 80, level: "HOT" },
      { min: 81, max: 100, level: "QUALIFIED" },
    ],
    notifyFromLevel: "HOT",
    convertFromLevel: "QUALIFIED",
    convertedStage: "converted",
    requirePaymentConfirmation: false,
  },
  discount: {
    enabled: true,
    maximumPercent: 10,
    requiresApprovalAbovePercent: 10,
    type: "percent",
  },
  escalation: {
    onHumanRequest: true,
    onUnknownInfo: true,
    onComplaint: true,
    onDiscountExceeded: true,
    onLowConfidence: true,
    onQualifiedLead: false,
    lowConfidenceThreshold: 0.4,
    customerMessage:
      "I'm connecting you with a team member who can help from here.",
  },
});

const section = "rounded-2xl bg-white p-6 space-y-4";
const label = "text-sm font-medium text-slate-700";

const AiSalesAgentSetting = () => {
  const { accountId } = useAuthStore();
  const toast = new ToastMessageService();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<WhatsAppAiAgentConfig>(emptyConfig());
  const [knowledge, setKnowledge] = useState<KnowledgeArticle[]>([]);
  const [article, setArticle] = useState({ title: "", content: "", tags: "" });

  useEffect(() => {
    if (!accountId) return;
    void whatsappAiAgentService
      .getConfig(String(accountId))
      .then((response) => {
        const doc = response.data?.doc;
        if (!doc) return;
        setConfig({ ...emptyConfig(), ...doc });
        setKnowledge(doc.knowledge || []);
      })
      .catch((error) => toast.error(error?.message || "Could not load AI agent"))
      .finally(() => setLoading(false));
  }, [accountId]);

  const save = async () => {
    if (!accountId) return;
    setSaving(true);
    try {
      const response = await whatsappAiAgentService.updateConfig(String(accountId), config);
      if (response.data?.doc) setConfig((prev) => ({ ...prev, ...response.data.doc }));
      toast.success("AI sales agent saved");
    } catch (error: any) {
      toast.error(error?.message || "Could not save AI agent");
    } finally {
      setSaving(false);
    }
  };

  const addField = () => {
    const key = `field_${Date.now()}`;
    setConfig((prev) => ({
      ...prev,
      qualificationFields: [
        ...prev.qualificationFields,
        { key, label: "New field", required: false, type: "text" },
      ],
    }));
  };

  const updateField = (index: number, patch: Partial<QualificationField>) => {
    setConfig((prev) => ({
      ...prev,
      qualificationFields: prev.qualificationFields.map((field, i) =>
        i === index ? { ...field, ...patch, key: slug(patch.key ?? field.key) } : field,
      ),
    }));
  };

  const addKnowledge = async () => {
    if (!accountId || !article.title.trim() || !article.content.trim()) {
      toast.error("Enter a knowledge title and content");
      return;
    }
    try {
      const response = await whatsappAiAgentService.createKnowledge(String(accountId), {
        title: article.title.trim(),
        content: article.content.trim(),
        tags: article.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      });
      if (response.data?.doc) setKnowledge((prev) => [response.data.doc, ...prev]);
      setArticle({ title: "", content: "", tags: "" });
      toast.success("Knowledge article added");
    } catch (error: any) {
      toast.error(error?.message || "Could not add knowledge");
    }
  };

  const removeKnowledge = async (id: string) => {
    if (!accountId) return;
    try {
      await whatsappAiAgentService.removeKnowledge(String(accountId), id);
      setKnowledge((prev) => prev.filter((item) => item.id !== id));
    } catch (error: any) {
      toast.error(error?.message || "Could not delete knowledge");
    }
  };

  if (loading) return <DataLoader className="h-[calc(100vh-180px)]" />;

  return (
    <FeatureGate feature={FEATURE.WHATSAPP_AI_AGENT}>
      <div className="max-w-7xl mx-auto py-10 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">AI Sales Agent</h1>
            <p className="text-sm text-slate-500 mt-1">
              One configurable WhatsApp sales agent. Industry behavior comes from this
              account&apos;s knowledge, qualification fields, and WhatsApp assets.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">Enabled</span>
            <Switch
              checked={config.enabled}
              onCheckedChange={(enabled) => setConfig((prev) => ({ ...prev, enabled }))}
            />
            <Button
              className="rounded-xl bg-teal-900 hover:bg-teal-900/80"
              disabled={saving}
              onClick={() => void save()}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <section className={section}>
          <h2 className="font-medium">Business profile</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className={label}>Business name</p>
              <Input
                className="mt-1 rounded-xl"
                value={config.businessProfile.name}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    businessProfile: { ...prev.businessProfile, name: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <p className={label}>Industry (optional hint)</p>
              <Input
                className="mt-1 rounded-xl"
                placeholder="Hotel, real estate, restaurant..."
                value={config.businessProfile.industry}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    businessProfile: { ...prev.businessProfile, industry: e.target.value },
                  }))
                }
              />
            </div>
          </div>
          <div>
            <p className={label}>About the business</p>
            <Textarea
              className="mt-1 rounded-xl"
              rows={3}
              value={config.businessProfile.description}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  businessProfile: { ...prev.businessProfile, description: e.target.value },
                }))
              }
            />
          </div>
          <div>
            <p className={label}>Agent instructions</p>
            <Textarea
              className="mt-1 rounded-xl min-h-32"
              value={config.instructions}
              onChange={(e) => setConfig((prev) => ({ ...prev, instructions: e.target.value }))}
            />
          </div>
        </section>

        <section className={section}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Qualification fields</h2>
              <p className="text-sm text-slate-500">
                The agent collects these naturally during conversation.
              </p>
            </div>
            <Button variant="outline" className="rounded-xl" onClick={addField}>
              <Plus size={16} /> Add field
            </Button>
          </div>
          <div className="space-y-3">
            {config.qualificationFields.length === 0 && (
              <p className="text-sm text-slate-500">
                Add fields such as check_in, guests, budget, or property_type.
              </p>
            )}
            {config.qualificationFields.map((field, index) => (
              <div key={`${field.key}-${index}`} className="grid md:grid-cols-12 gap-2 items-center">
                <Input
                  className="md:col-span-3 rounded-xl"
                  placeholder="key"
                  value={field.key}
                  onChange={(e) => updateField(index, { key: e.target.value })}
                />
                <Input
                  className="md:col-span-4 rounded-xl"
                  placeholder="Label"
                  value={field.label}
                  onChange={(e) => updateField(index, { label: e.target.value })}
                />
                <select
                  className="md:col-span-2 h-9 rounded-xl border px-2 text-sm"
                  value={field.type}
                  onChange={(e) =>
                    updateField(index, { type: e.target.value as QualificationField["type"] })
                  }
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="enum">Options</option>
                </select>
                <label className="md:col-span-2 flex items-center gap-2 text-sm">
                  <Switch
                    checked={field.required}
                    onCheckedChange={(required) => updateField(index, { required })}
                  />
                  Required
                </label>
                <button
                  className="md:col-span-1 text-slate-500"
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      qualificationFields: prev.qualificationFields.filter((_, i) => i !== index),
                    }))
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className={section}>
          <h2 className="font-medium">Lead scoring & conversion</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className={label}>Notify from level</p>
              <Input
                className="mt-1 rounded-xl"
                value={config.scoring.notifyFromLevel}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    scoring: { ...prev.scoring, notifyFromLevel: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <p className={label}>Convert from level</p>
              <Input
                className="mt-1 rounded-xl"
                value={config.scoring.convertFromLevel}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    scoring: { ...prev.scoring, convertFromLevel: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <p className={label}>Converted stage name</p>
              <Input
                className="mt-1 rounded-xl"
                value={config.scoring.convertedStage}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    scoring: { ...prev.scoring, convertedStage: e.target.value },
                  }))
                }
              />
            </div>
            <label className="flex items-center gap-2 text-sm mt-6">
              <Switch
                checked={config.scoring.requirePaymentConfirmation}
                onCheckedChange={(requirePaymentConfirmation) =>
                  setConfig((prev) => ({
                    ...prev,
                    scoring: { ...prev.scoring, requirePaymentConfirmation },
                  }))
                }
              />
              Require payment/booking confirmation before conversion
            </label>
          </div>
        </section>

        <section className={section}>
          <h2 className="font-medium">Negotiation</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={config.discount.enabled}
                onCheckedChange={(enabled) =>
                  setConfig((prev) => ({ ...prev, discount: { ...prev.discount, enabled } }))
                }
              />
              Allow discounts
            </label>
            <div>
              <p className={label}>Maximum discount %</p>
              <Input
                type="number"
                className="mt-1 rounded-xl"
                value={config.discount.maximumPercent}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    discount: { ...prev.discount, maximumPercent: Number(e.target.value) },
                  }))
                }
              />
            </div>
          </div>
        </section>

        <section className={section}>
          <h2 className="font-medium">Human escalation</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {(
              [
                ["onHumanRequest", "Customer asks for a human"],
                ["onUnknownInfo", "Information is not in the knowledge base"],
                ["onComplaint", "Complaint or support issue"],
                ["onDiscountExceeded", "Discount exceeds the allowed limit"],
                ["onLowConfidence", "Agent confidence is too low"],
                ["onQualifiedLead", "Qualified lead needs human follow-up"],
              ] as const
            ).map(([key, text]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <Switch
                  checked={Boolean(config.escalation[key])}
                  onCheckedChange={(value) =>
                    setConfig((prev) => ({
                      ...prev,
                      escalation: { ...prev.escalation, [key]: value },
                    }))
                  }
                />
                {text}
              </label>
            ))}
          </div>
          <div>
            <p className={label}>Message sent when escalating</p>
            <Textarea
              className="mt-1 rounded-xl"
              value={config.escalation.customerMessage}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  escalation: { ...prev.escalation, customerMessage: e.target.value },
                }))
              }
            />
          </div>
        </section>

        <section className={section}>
          <h2 className="font-medium">Knowledge base</h2>
          <p className="text-sm text-slate-500">
            The agent answers only from these articles plus CRM context. It will not invent prices or policies.
          </p>
          <div className="grid gap-3">
            <Input
              className="rounded-xl"
              placeholder="Article title"
              value={article.title}
              onChange={(e) => setArticle((prev) => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              className="rounded-xl min-h-24"
              placeholder="Prices, policies, rooms, properties, FAQs..."
              value={article.content}
              onChange={(e) => setArticle((prev) => ({ ...prev, content: e.target.value }))}
            />
            <div className="flex gap-3">
              <Input
                className="rounded-xl"
                placeholder="Tags, comma separated"
                value={article.tags}
                onChange={(e) => setArticle((prev) => ({ ...prev, tags: e.target.value }))}
              />
              <Button variant="outline" className="rounded-xl" onClick={() => void addKnowledge()}>
                Add article
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            {knowledge.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 rounded-xl border p-3">
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">{item.content}</p>
                </div>
                <button onClick={() => void removeKnowledge(item.id)}>
                  <Trash2 size={16} className="text-slate-500" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {config.assets && (
          <section className={section}>
            <h2 className="font-medium">Available WhatsApp assets</h2>
            <p className="text-sm text-slate-500">
              The agent only selects existing canned messages and approved templates. It never creates new ones.
            </p>
            <p className="text-sm">
              {config.assets.canned.length} canned messages · {config.assets.templates.length} templates
            </p>
          </section>
        )}
      </div>
    </FeatureGate>
  );
};

const slug = (value: string) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

export default AiSalesAgentSetting;
