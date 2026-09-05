import { FEATURE, type FeatureKey } from "@/constants/subscription.constant";
import { SubscriptionService } from "@/services/subscription.service";
import type { OrganizationSubscriptionSnapshot } from "@/types/subscription.type";
import { useCallback, useEffect, useMemo, useState } from "react";

const subscriptionService = new SubscriptionService();

export function useSubscription() {
  const [subscription, setSubscription] =
    useState<OrganizationSubscriptionSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.getCurrent();
      setSubscription(response.data?.doc || null);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to load subscription");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const canAccessFeature = useCallback(
    (feature: FeatureKey | string) => {
      if (!subscription) return false;
      if (subscription.isExpired) return false;
      return Boolean(subscription.features?.[feature]);
    },
    [subscription],
  );

  const values = useMemo(() => {
    const status = subscription?.status;
    return {
      subscription,
      plan: subscription?.plan || null,
      status,
      isTrial: Boolean(subscription?.isTrial),
      isActive: Boolean(subscription?.isActive),
      isExpired: Boolean(subscription?.isExpired),
      trialDaysRemaining: subscription?.trial?.daysRemaining ?? 0,
      features: subscription?.features || {},
      limits: subscription?.limits,
      usage: subscription?.usage,
      loading,
      error,
      refresh,
      canAccessFeature,
      FEATURE,
    };
  }, [subscription, loading, error, refresh, canAccessFeature]);

  return values;
}
