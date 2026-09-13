import { RefreshCw, Sparkles, Mail, Phone, Target } from "lucide-react";
import { useState } from "react";
import { leadService } from "@/pages/LeadCentre/services/lead.service";
import { useAuthStore } from "@/stores";
import { ToastMessageService } from "@/services";

interface AILeadSummaryProps {
  leadId: string;
}

const formatLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
};

const priorityColor = (priority?: string) => {
  const p = (priority || "").toLowerCase();
  if (p.includes("high")) return { bg: "bg-red-50", text: "text-red-600" };
  if (p.includes("medium"))
    return { bg: "bg-amber-50", text: "text-amber-600" };
  if (p.includes("low")) return { bg: "bg-green-50", text: "text-green-600" };
  return { bg: "bg-gray-100", text: "text-gray-600" };
};

const AILeadSummary = ({ leadId }: AILeadSummaryProps) => {
  const { accountId } = useAuthStore((state) => state);
  const toastService = new ToastMessageService();
  const [aiSummary, setAiSummary] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);

  const generateLeadSummary = async () => {
    if (!accountId || !leadId) return;

    try {
      setLoading(true);
      const res = await leadService.getLeadSummary(String(accountId), leadId);
      const doc = res?.data?.doc ?? null;
      setAiSummary(doc);
    } catch (error: any) {
      toastService.apiError(error?.message || "Failed to generate AI summary");
    } finally {
      setLoading(false);
    }
  };

  if (!aiSummary) {
    return (
      <div>
        <button
          onClick={generateLeadSummary}
          disabled={loading}
          className="bg-primary/10 hover:bg-primary/20 cursor-pointer flex items-center mt-4 gap-2 px-4 py-2 text-sm rounded-2xl text-primary transition-colors"
        >
          {!loading ? (
            <span className="flex gap-2 items-center">
              <Sparkles size={16} />
              Generate AI summary
            </span>
          ) : (
            <span className="flex gap-2 items-center animate-pulse">
              <Sparkles size={16} /> Generating lead summary...
            </span>
          )}
        </button>
      </div>
    );
  }

  const assessment = aiSummary.assessment ?? {};
  const contactInfo = aiSummary.contactInformation ?? {};

  const summaryText =
    aiSummary.summary ??
    assessment.reasoning ??
    "No summary available for this lead.";

  const priority = assessment.priority;
  const priorityStyle = priorityColor(priority);

  const contactFlags = Object.entries(contactInfo).filter(([key]) =>
    key.toLowerCase().includes("provided"),
  );

  return (
    <div className="rounded-2xl bg-white p-5 max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <Sparkles size={16} className="text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-800 text-sm">AI lead summary</h3>
        </div>
        {priority && (
          <span
            className={`text-xs px-2.5 py-1 rounded-md font-medium ${priorityStyle.bg} ${priorityStyle.text}`}
          >
            {formatLabel(priority)} priority
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{summaryText}</p>

      {contactFlags.length > 0 && (
        <div className="border-t pt-3 space-y-2">
          <p className="text-xs font-medium text-gray-500">
            Contact information
          </p>
          <div className="flex gap-2 flex-wrap">
            {contactFlags.map(([key, val]) => {
              const isEmail = key.toLowerCase().includes("email");
              const ok = Boolean(val);
              return (
                <span
                  key={key}
                  className={`text-xs px-2.5 py-1 rounded-2xl flex items-center gap-1 ${ok ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    }`}
                >
                  {isEmail ? <Mail size={13} /> : <Phone size={13} />}
                  {isEmail ? "Email" : "Phone"} {ok ? "provided" : "missing"}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {Array.isArray(aiSummary.key_requirements) &&
        aiSummary.key_requirements.length > 0 && (
          <div className="border-t pt-3">
            <p className="text-xs font-medium text-gray-500 mb-2">
              Key requirements
            </p>
            <div className="flex flex-wrap gap-2">
              {aiSummary.key_requirements.map((req: string, idx: number) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-2xl bg-gray-100 text-gray-700"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>
        )}

      {(assessment.recommendedAction || aiSummary.next_action) && (
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs font-medium text-blue-600 mb-1 flex items-center gap-1">
            <Target size={13} /> Recommended action
          </p>
          <p className="text-[13px] text-blue-700 leading-relaxed">
            {assessment.recommendedAction || aiSummary.next_action}
          </p>
        </div>
      )}

      <button
        onClick={generateLeadSummary}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 cursor-pointer px-4 py-2 text-sm rounded-2xl text-gray-700 transition-colors"
      >
        <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        <span className={loading ? "animate-pulse" : ""}>
          Regenerate AI summary
        </span>
      </button>
    </div>
  );
};

export default AILeadSummary;
