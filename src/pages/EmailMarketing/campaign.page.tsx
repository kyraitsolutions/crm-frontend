import { FeatureGate } from "@/components/subscription/FeatureGate";
import { FEATURE } from "@/constants/subscription.constant";
import { EMAIL_MARKETING_PATHS } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useEmailMarketingStore } from "./store/email-marketing.store";
import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  Mail,
  MousePointerClick,
  Plus,
  Send,
  UserMinus,
  Users,
  XCircle,
} from "lucide-react";
import DataLoader from "@/components/Loader/data-loader";

const filters = [
  { value: "ALL", label: "All campaigns" },
  { value: "DRAFT", label: "Draft" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "SENDING", label: "Sending" },
  { value: "COMPLETED", label: "Completed" },
  { value: "FAILED", label: "Failed" },
];

const statusStyles: Record<
  string,
  {
    label: string;
    className: string;
    dot: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    className: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  },
  SCHEDULED: {
    label: "Scheduled",
    className: "bg-violet-50 text-violet-700 border-violet-100",
    dot: "bg-violet-500",
  },
  SENDING: {
    label: "Sending",
    className: "bg-blue-50 text-blue-700 border-blue-100",
    dot: "bg-blue-500",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dot: "bg-emerald-500",
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-50 text-red-700 border-red-100",
    dot: "bg-red-500",
  },
};

const CampaignsPage = () => {
  const { accountId } = useAuthStore();

  const {
    campaigns,
    fetchCampaigns,
    loading,
  } = useEmailMarketingStore();

  const [status, setStatus] = useState("ALL");

  const base = EMAIL_MARKETING_PATHS.base(String(accountId));

  useEffect(() => {
    if (accountId) {
      void fetchCampaigns(String(accountId), status);
    }
  }, [accountId, status, fetchCampaigns]);

  const getStatusConfig = (campaignStatus: string) => {
    return (
      statusStyles[campaignStatus] || {
        label: campaignStatus,
        className: "bg-slate-100 text-slate-700 border-slate-200",
        dot: "bg-slate-400",
      }
    );
  };

  return (
    <FeatureGate feature={FEATURE.EMAIL_MARKETING}>
      <div className="min-h-full bg-[#f8fafc]">
        <div className="mx-auto max-w-[1600px] space-y-5 p-5 lg:p-6">

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                <Mail className="h-3.5 w-3.5" />
                Email Marketing
                <ChevronRight className="h-3.5 w-3.5" />
                Campaigns
              </div>

              <h1 className="text-xl font-semibold tracking-tight text-slate-950">
                Campaigns
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Create, schedule, and measure email campaigns.
              </p>
            </div>

            <Button
              asChild
              className="rounded-xl"
            >
              <Link
                to={EMAIL_MARKETING_PATHS.createCampaign(
                  String(accountId),
                )}
              >
                <Plus className="h-4 w-4" />
                New campaign
              </Link>
            </Button>
          </div>

          {/* Campaign summary */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <SummaryCard
              title="Campaigns"
              value={campaigns.length}
              subtitle="In this view"
              icon={Mail}
              iconClassName="bg-violet-50 text-violet-600"
            />

            <SummaryCard
              title="Recipients"
              value={campaigns.reduce(
                (sum, campaign) =>
                  sum +
                  (campaign.totalRecipients ||
                    campaign.eligibleCount ||
                    0),
                0,
              )}
              subtitle="Total audience"
              icon={Users}
              iconClassName="bg-blue-50 text-blue-600"
            />

            <SummaryCard
              title="Sent"
              value={campaigns.reduce(
                (sum, campaign) =>
                  sum + (campaign.sentCount || 0),
                0,
              )}
              subtitle="Emails sent"
              icon={Send}
              iconClassName="bg-emerald-50 text-emerald-600"
            />

            <SummaryCard
              title="Opened"
              value={`${getAverageRate(
                campaigns,
                "openRate",
              )}%`}
              subtitle="Average open rate"
              icon={MousePointerClick}
              iconClassName="bg-amber-50 text-amber-600"
            />
          </div>

          {/* Campaign table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            {/* Toolbar */}
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Email campaigns
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Track delivery, engagement, and subscriber activity.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex max-w-full gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1">
                  {filters.map((item) => {
                    const active = status === item.value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setStatus(item.value)}
                        className={[
                          "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                          active
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-900",
                        ].join(" ")}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex h-80 items-center justify-center">
                <DataLoader className="h-64" />
              </div>
            ) : campaigns.length === 0 ? (
              <EmptyState status={status} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-sm">

                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70">
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Campaign
                      </th>

                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Audience
                      </th>

                      <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Sent
                      </th>

                      <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Delivered
                      </th>

                      <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Opened
                      </th>

                      <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Clicked
                      </th>

                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Unsubscribed
                      </th>

                      <th className="w-8 px-2" />
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {campaigns.map((campaign) => {
                      const config = getStatusConfig(
                        campaign.status,
                      );

                      const audience =
                        campaign.totalRecipients ||
                        campaign.eligibleCount ||
                        0;

                      const sent = campaign.sentCount || 0;
                      const delivered =
                        campaign.deliveredCount || 0;

                      const openRate =
                        campaign.rates?.openRate ?? 0;

                      const clickRate =
                        campaign.rates?.clickRate ?? 0;

                      const unsubscribed =
                        campaign.unsubscribedCount || 0;

                      return (
                        <tr
                          key={campaign.id}
                          className="group transition-colors hover:bg-slate-50/70"
                        >
                          {/* Campaign */}
                          <td className="px-5 py-4">
                            <Link
                              to={`${base}/campaigns/${campaign.id}`}
                              className="flex items-center gap-3"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff0ea] text-primary">
                                <Mail className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-medium text-slate-900 transition-colors group-hover:text-primary">
                                  {campaign.name}
                                </p>

                                <p className="mt-0.5 max-w-[300px] truncate text-xs text-slate-500">
                                  {campaign.subject || "No subject"}
                                </p>
                              </div>
                            </Link>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-4">
                            <span
                              className={[
                                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                                config.className,
                              ].join(" ")}
                            >
                              <span
                                className={[
                                  "h-1.5 w-1.5 rounded-full",
                                  config.dot,
                                ].join(" ")}
                              />

                              {config.label}
                            </span>
                          </td>

                          {/* Audience */}
                          <td className="px-4 py-4 text-right font-medium text-slate-700">
                            {Number(audience).toLocaleString()}
                          </td>

                          {/* Sent */}
                          <td className="px-4 py-4 text-right">
                            <MetricValue
                              value={sent}
                              icon={Send}
                            />
                          </td>

                          {/* Delivered */}
                          <td className="px-4 py-4 text-right">
                            <MetricValue
                              value={delivered}
                              icon={CheckCircle2}
                            />
                          </td>

                          {/* Opened */}
                          <td className="px-4 py-4 text-right">
                            <div className="inline-flex flex-col items-end">
                              <span className="font-semibold text-slate-800">
                                {openRate}%
                              </span>

                              <span className="mt-0.5 text-[10px] text-slate-400">
                                open rate
                              </span>
                            </div>
                          </td>

                          {/* Clicked */}
                          <td className="px-4 py-4 text-right">
                            <div className="inline-flex flex-col items-end">
                              <span className="font-semibold text-slate-800">
                                {clickRate}%
                              </span>

                              <span className="mt-0.5 text-[10px] text-slate-400">
                                click rate
                              </span>
                            </div>
                          </td>

                          {/* Unsubscribed */}
                          <td className="px-5 py-4 text-right">
                            <span
                              className={
                                unsubscribed > 0
                                  ? "font-medium text-amber-600"
                                  : "text-slate-500"
                              }
                            >
                              {unsubscribed.toLocaleString()}
                            </span>
                          </td>

                          {/* Arrow */}
                          <td className="px-2 py-4">
                            <Link
                              to={`${base}/campaigns/${campaign.id}`}
                              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 opacity-0 transition-all hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            {!loading && campaigns.length > 0 && (
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-5 py-3">
                <p className="text-xs text-slate-500">
                  Showing {campaigns.length} campaign
                  {campaigns.length !== 1 ? "s" : ""}
                </p>

                {campaigns.some(
                  (campaign) =>
                    (campaign.unsubscribedCount || 0) > 0,
                ) && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-600">
                      <UserMinus className="h-3.5 w-3.5" />
                      Subscriber opt-outs are included in the
                      metrics.
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </FeatureGate>
  );
};

/* ================================================================
   SUMMARY CARD
================================================================ */

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClassName,
}: {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ElementType;
  iconClassName: string;
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full ${iconClassName}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="mt-3">
        <p className="text-xl font-semibold tracking-tight text-slate-950">
          {typeof value === "number"
            ? value.toLocaleString()
            : value}
        </p>

        <p className="mt-0.5 text-sm font-medium text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-[11px] text-slate-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

/* ================================================================
   METRIC VALUE
================================================================ */

const MetricValue = ({
  value,
  icon: Icon,
}: {
  value: number;
  icon: React.ElementType;
}) => {
  return (
    <span className="inline-flex items-center justify-end gap-1.5 font-medium text-slate-700">
      <Icon className="h-3.5 w-3.5 text-slate-400" />
      {Number(value || 0).toLocaleString()}
    </span>
  );
};

/* ================================================================
   EMPTY STATE
================================================================ */

const EmptyState = ({ status }: { status: string }) => {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        {status === "FAILED" ? (
          <XCircle className="h-5 w-5" />
        ) : status === "SCHEDULED" ? (
          <Clock3 className="h-5 w-5" />
        ) : (
          <Mail className="h-5 w-5" />
        )}
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-900">
        {status === "ALL"
          ? "No campaigns yet"
          : `No ${status.toLowerCase()} campaigns`}
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
        {status === "ALL"
          ? "Create your first email campaign to start reaching and engaging your contacts."
          : "There are no campaigns matching this status right now."}
      </p>
    </div>
  );
};

/* ================================================================
   HELPERS
================================================================ */

const getAverageRate = (
  campaigns: any[],
  rateKey: string,
) => {
  if (!campaigns.length) return 0;

  const total = campaigns.reduce(
    (sum, campaign) =>
      sum + Number(campaign.rates?.[rateKey] ?? 0),
    0,
  );

  return Math.round((total / campaigns.length) * 10) / 10;
};

export default CampaignsPage;