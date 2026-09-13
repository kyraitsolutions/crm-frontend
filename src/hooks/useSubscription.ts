import { FEATURE, type FeatureKey } from "@/constants/subscription.constant";
import { SubscriptionService } from "@/services/subscription.service";
import type { OrganizationSubscriptionSnapshot } from "@/types/subscription.type";
import { useCallback, useEffect, useMemo, useState } from "react";

const subscriptionService = new SubscriptionService();

let cachedSubscription: OrganizationSubscriptionSnapshot | null = null;
let inflight: Promise<OrganizationSubscriptionSnapshot | null> | null = null;

const loadSubscription = async (force = false) => {
  if (!force && cachedSubscription) {
    return cachedSubscription;
  }
  if (!force && inflight) {
    return inflight;
  }

  inflight = subscriptionService
    .getCurrent()
    .then((response) => {
      cachedSubscription = response.data?.doc || null;
      return cachedSubscription;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
};

export function useSubscription() {
  const [subscription, setSubscription] =
    useState<OrganizationSubscriptionSnapshot | null>(cachedSubscription);
  const [loading, setLoading] = useState(!cachedSubscription);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (force = true) => {
    try {
      if (!cachedSubscription) setLoading(true);
      const next = await loadSubscription(force);
      setSubscription(next);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to load subscription");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh(false);
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
      refresh: () => refresh(true),
      canAccessFeature,
      FEATURE,
    };
  }, [subscription, loading, error, refresh, canAccessFeature]);

  return values;
}
