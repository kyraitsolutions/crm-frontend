import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "react-router-dom";

export function TrialBanner() {
  const { subscription, isTrial, isExpired, trialDaysRemaining, loading } =
    useSubscription();

  if (loading || !subscription) return null;

  if (isExpired) {
    return (
      <div className="flex items-center justify-between gap-3 bg-red-50 text-red-800 px-4 py-2 text-sm border-b border-red-100">
        <p>Your free trial has ended. Upgrade your plan to continue using Kyra AI CRM.</p>
        <Button asChild size="sm" className="h-8">
          <Link to="/dashboard/settings/subscription">Upgrade Plan</Link>
        </Button>
      </div>
    );
  }

  if (isTrial && trialDaysRemaining <= 2) {
    return (
      <div className="flex items-center justify-between gap-3 bg-amber-50 text-amber-900 px-4 py-2 text-sm border-b border-amber-100">
        <p>
          Your trial ends in {trialDaysRemaining} day
          {trialDaysRemaining === 1 ? "" : "s"}. Upgrade now to avoid interruption.
        </p>
        <Button asChild size="sm" className="h-8">
          <Link to="/dashboard/settings/subscription">Upgrade</Link>
        </Button>
      </div>
    );
  }

  if (isTrial) {
    return (
      <div className="flex items-center justify-between gap-3 bg-sky-50 text-sky-900 px-4 py-2 text-sm border-b border-sky-100">
        <p>Your free trial ends in {trialDaysRemaining} days.</p>
        <Button asChild size="sm" variant="outline" className="h-8">
          <Link to="/dashboard/settings/subscription">Upgrade</Link>
        </Button>
      </div>
    );
  }

  return null;
}
