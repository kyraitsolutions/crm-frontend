import { Button } from "@/components/ui/button";
import DataLoader from "@/components/Loader/data-loader";
import { ToastMessageService } from "@/services";
import { useAuthStore } from "@/stores";
import type { ApiError } from "@/types";
import {
  BarChart3,
  Heart,
  RefreshCcw,
  Star,
  Users,
  Eye,
} from "lucide-react";
import { useEffect } from "react";
import { EmptyState } from "../components/EmptyState";
import { FacebookPageShell } from "../components/FacebookPageShell";
import { PermissionWarning } from "../components/PermissionWarning";
import { StatCard } from "@/pages/Channels/whatsapp/components/cards/StatCard";
import { GlassCard } from "@/pages/Channels/whatsapp/components/cards/GlassCard";
import { useMetaPageStore } from "../store/meta-page.store";
import { formatFacebookDate, formatFacebookNumber } from "../utils/format";
import { useActiveFacebookPage } from "../utils/pages";

const InsightsPage = () => {
  const accountId = useAuthStore((state) => state.accountId);
  const toastService = new ToastMessageService();
  const { insights, insightsLoading, fetchInsights } = useMetaPageStore(
    (state) => state,
  );
  const { activePageId } = useActiveFacebookPage();

  const loadInsights = async () => {
    if (!accountId) return;
    try {
      await fetchInsights(String(accountId));
    } catch (error) {
      const err = error as ApiError;
      toastService.error(err.message || "Failed to load Page insights");
    }
  };

  useEffect(() => {
    loadInsights();
  }, [accountId, activePageId]);

  const page = insights?.page;
  const hasSnapshot =
    page &&
    (page.fanCount != null ||
      page.followersCount != null ||
      page.talkingAboutCount != null ||
      page.ratingCount != null);
  const hasMetrics = Boolean(insights?.metrics?.length);

  return (
    <FacebookPageShell>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Insights</h2>
          <p className="text-sm text-slate-500">
            Audience and engagement snapshot for the connected Facebook Page.
          </p>
        </div>
        <Button variant="outline" onClick={loadInsights} disabled={insightsLoading}>
          <RefreshCcw className="size-4" />
          Refresh
        </Button>
      </div>

      <PermissionWarning message={insights?.warning} />

      {insightsLoading ? (
        <DataLoader className="h-[40vh]" />
      ) : !hasSnapshot && !hasMetrics ? (
        <EmptyState
          icon={BarChart3}
          title="Insights unavailable"
          description="Facebook needs pages_read_engagement or read_insights to show Page stats. Add the permission and reconnect."
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Followers"
              value={formatFacebookNumber(page?.followersCount)}
              icon={Users}
              iconBg="bg-blue-500/20"
              iconColor="text-blue-400"
            />
            <StatCard
              title="Page likes"
              value={formatFacebookNumber(page?.fanCount)}
              icon={Heart}
              iconBg="bg-rose-500/20"
              iconColor="text-rose-400"
            />
            <StatCard
              title="Talking about"
              value={formatFacebookNumber(page?.talkingAboutCount)}
              icon={Eye}
              iconBg="bg-violet-500/20"
              iconColor="text-violet-400"
            />
            <StatCard
              title="Rating"
              value={
                page?.overallStarRating != null
                  ? `${page.overallStarRating}${page.ratingCount ? ` (${formatFacebookNumber(page.ratingCount)})` : ""}`
                  : "—"
              }
              icon={Star}
              iconBg="bg-amber-500/20"
              iconColor="text-amber-400"
            />
          </div>

          {hasMetrics ? (
            <GlassCard className="p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
                Daily metrics
              </h3>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {insights?.metrics.map((metric) => (
                  <div
                    key={metric.name}
                    className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      {metric.title}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-800">
                      {formatFacebookNumber(metric.value)}
                    </p>
                    {metric.endTime ? (
                      <p className="mt-1 text-xs text-slate-400">
                        {formatFacebookDate(metric.endTime)}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </GlassCard>
          ) : null}
        </>
      )}
    </FacebookPageShell>
  );
};

export default InsightsPage;
