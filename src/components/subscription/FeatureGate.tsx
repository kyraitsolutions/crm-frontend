import { FEATURE_LABELS, type FeatureKey } from "@/constants/subscription.constant";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface FeatureGateProps {
  feature: FeatureKey | string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { canAccessFeature, loading } = useSubscription();

  if (loading) return null;

  if (canAccessFeature(feature)) {
    return <>{children}</>;
  }

  if (fallback) return <>{fallback}</>;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
      <p className="font-medium text-slate-800">
        {FEATURE_LABELS[feature] || feature} requires an active subscription.
      </p>
      <p className="text-sm text-slate-500">
        Upgrade your plan to continue using this feature.
      </p>
      <Button asChild>
        <Link to="/dashboard/settings/subscription">Upgrade Plan</Link>
      </Button>
    </div>
  );
}
