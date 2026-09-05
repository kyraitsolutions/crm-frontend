import { FEATURE, FEATURE_LABELS } from "@/constants/subscription.constant";
import { FeatureGate } from "@/components/subscription/FeatureGate";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function WhatsAppAiAgentCard() {
  const { canAccessFeature, isTrial, usage, limits, isExpired } = useSubscription();
  const allowed = canAccessFeature(FEATURE.WHATSAPP_AI_AGENT);
  const used = usage?.aiConversations ?? 0;
  const limit = limits?.aiConversationsPerMonth ?? 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-800">
          {FEATURE_LABELS[FEATURE.WHATSAPP_AI_AGENT]}
        </h3>
        <span className="text-xs rounded-full bg-amber-100 text-amber-800 px-2 py-1">
          Premium Feature
        </span>
      </div>
      <p className="text-sm text-slate-600">
        Let AI automatically respond to customers, answer questions, qualify leads
        and assist your sales team.
      </p>

      {isTrial && allowed && (
        <p className="text-sm text-slate-500">
          Trial usage: {used.toLocaleString()} / {limit.toLocaleString()} AI conversations
        </p>
      )}

      {allowed && used >= limit && limit > 0 && (
        <p className="text-sm text-red-600">
          AI Agent usage limit reached. Upgrade your plan to continue.
        </p>
      )}

      {isExpired && (
        <p className="text-sm text-slate-600">Your trial access has ended.</p>
      )}

      <FeatureGate
        feature={FEATURE.WHATSAPP_AI_AGENT}
        fallback={
          <Button asChild>
            <Link to="/dashboard/settings/subscription">Upgrade to Enable</Link>
          </Button>
        }
      >
        <Button asChild variant="outline">
          <Link to="/dashboard/settings/subscription">
            {isTrial ? "Continue Using AI" : "Manage AI Agent"}
          </Link>
        </Button>
      </FeatureGate>
    </div>
  );
}
