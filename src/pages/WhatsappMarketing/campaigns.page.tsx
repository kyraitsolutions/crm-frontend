import { FeatureGate } from "@/components/subscription/FeatureGate";
import { FEATURE } from "@/constants/subscription.constant";
import { WHATSAPP_MARKETING_PATHS } from "@/constants/routes/whatsapp-marketing.path";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores";
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileWarning,
  Megaphone,
  MessageCircle,
  Plus,
  Send,
  Users,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useWhatsAppMarketingStore } from "./store/whatsapp-marketing.store";
import DataLoader from "@/components/Loader/data-loader";

const filters = [
  { value: "ALL", label: "All campaigns" },
  { value: "DRAFT", label: "Draft" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "SENDING", label: "Sending" },
  { value: "COMPLETED", label: "Completed" },
  { value: "FAILED", label: "Failed" },
];

const statusConfig: Record<
  string,
  {
    label: string;
    className: string;
    dotClassName: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    className: "bg-slate-100 text-slate-700 border-slate-200",
    dotClassName: "bg-slate-400",
  },
  SCHEDULED: {
    label: "Scheduled",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dotClassName: "bg-blue-500",
  },
  SENDING: {
    label: "Sending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dotClassName: "bg-amber-500",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClassName: "bg-emerald-500",
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-50 text-red-700 border-red-200",
    dotClassName: "bg-red-500",
  },
};

const WhatsAppCampaignsPage = () => {
  const { accountId } = useAuthStore();
  const { campaigns, fetchCampaigns, loading } =
    useWhatsAppMarketingStore();

  const [status, setStatus] = useState("ALL");

  const base = WHATSAPP_MARKETING_PATHS.base(String(accountId));

  useEffect(() => {
    if (accountId) {
      void fetchCampaigns(String(accountId), status);
    }
  }, [accountId, status, fetchCampaigns]);

  const overview = useMemo(() => {
    const total = campaigns.length;

    const recipients = campaigns.reduce(
      (sum, campaign) =>
        sum +
        (campaign.totalRecipients || campaign.eligibleCount || 0),
      0,
    );

    const sent = campaigns.reduce(
      (sum, campaign) => sum + (campaign.sentCount || 0),
      0,
    );

    const delivered = campaigns.reduce(
      (sum, campaign) => sum + (campaign.deliveredCount || 0),
      0,
    );

    const failed = campaigns.reduce(
      (sum, campaign) => sum + (campaign.failedCount || 0),
      0,
    );

    return {
      total,
      recipients,
      sent,
      delivered,
      failed,
    };
  }, [campaigns]);

  const getStatusConfig = (campaignStatus: string) => {
    return (
      statusConfig[campaignStatus] || {
        label: campaignStatus,
        className: "bg-slate-100 text-slate-700 border-slate-200",
        dotClassName: "bg-slate-400",
      }
    );
  };

  return (
    <FeatureGate feature={FEATURE.WHATSAPP_MESSAGING}>
      <div className="min-h-full bg-slate-50/60">
        <div className="mx-auto max-w-[1600px] space-y-6 p-6 lg:p-8">

          {/* Header */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                WhatsApp Marketing
                <ChevronRight className="h-3.5 w-3.5" />
                Campaigns
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                Campaigns
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Create, schedule and track WhatsApp marketing campaigns
                sent to your opted-in contacts.
              </p>
            </div>

            <Button
              asChild
              className=" rounded-xl"
            >
              <Link
                to={WHATSAPP_MARKETING_PATHS.createCampaign(
                  String(accountId),
                )}
              >
                <Plus className="h-4 w-4" />
                New campaign
              </Link>
            </Button>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <OverviewCard
              icon={<Megaphone className="h-4 w-4" />}
              label="Campaigns"
              value={overview.total}
            />

            <OverviewCard
              icon={<Users className="h-4 w-4" />}
              label="Recipients"
              value={overview.recipients.toLocaleString()}
            />

            <OverviewCard
              icon={<Send className="h-4 w-4" />}
              label="Messages sent"
              value={overview.sent.toLocaleString()}
            />

            <OverviewCard
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Delivered"
              value={overview.delivered.toLocaleString()}
            />
          </div>

          {/* Campaigns Card */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            {/* Toolbar */}
            <div className="border-b border-slate-200 px-4 py-4 lg:px-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Campaign activity
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Monitor delivery performance across your campaigns.
                  </p>
                </div>

                {/* Status filters */}
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

            {/* Table */}
            {loading ? (
              <div className="flex h-80 items-center justify-center">
                <DataLoader className="h-64" />
              </div>
            ) : campaigns.length === 0 ? (
              <EmptyState
                status={status}
                onCreate={() =>
                (window.location.href =
                  WHATSAPP_MARKETING_PATHS.createCampaign(
                    String(accountId),
                  ))
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-sm">

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
                        Read rate
                      </th>

                      <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Failed
                      </th>

                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Opted out
                      </th>

                      <th className="w-8 px-2" />
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {campaigns.map((campaign) => {
                      const config = getStatusConfig(campaign.status);

                      const audience =
                        campaign.totalRecipients ||
                        campaign.eligibleCount ||
                        0;

                      const sent = campaign.sentCount || 0;

                      const delivered =
                        campaign.deliveredCount || 0;

                      const readRate =
                        campaign.rates?.readRate ?? 0;

                      return (
                        <tr
                          key={campaign.id}
                          className="group transition-colors hover:bg-slate-50/80"
                        >
                          {/* Campaign */}
                          <td className="px-5 py-4">
                            <Link
                              to={`${base}/campaigns/${campaign.id}`}
                              className="block"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff1eb] text-primary">
                                  <MessageCircle className="h-4 w-4" />
                                </div>

                                <div className="min-w-0">
                                  <div className="truncate font-medium text-slate-900 group-hover:text-primary">
                                    {campaign.name}
                                  </div>

                                  <div className="mt-0.5 max-w-[260px] truncate text-xs text-slate-500">
                                    {campaign.templateName}
                                  </div>
                                </div>
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
                                  config.dotClassName,
                                ].join(" ")}
                              />

                              {config.label}
                            </span>
                          </td>

                          {/* Audience */}
                          <td className="px-4 py-4 text-right font-medium text-slate-700">
                            {audience.toLocaleString()}
                          </td>

                          {/* Sent */}
                          <td className="px-4 py-4 text-right">
                            <MetricValue
                              value={sent}
                              icon={
                                <Send className="h-3.5 w-3.5" />
                              }
                            />
                          </td>

                          {/* Delivered */}
                          <td className="px-4 py-4 text-right">
                            <MetricValue
                              value={delivered}
                              icon={
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              }
                            />
                          </td>

                          {/* Read */}
                          <td className="px-4 py-4 text-right">
                            <span className="font-medium text-slate-700">
                              {readRate}%
                            </span>
                          </td>

                          {/* Failed */}
                          <td className="px-4 py-4 text-right">
                            <span
                              className={
                                campaign.failedCount
                                  ? "font-medium text-red-600"
                                  : "text-slate-500"
                              }
                            >
                              {campaign.failedCount || 0}
                            </span>
                          </td>

                          {/* Opted out */}
                          <td className="px-5 py-4 text-right">
                            <span className="text-slate-600">
                              {campaign.optedOutCount || 0}
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

                {overview.failed > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600">
                    <XCircle className="h-3.5 w-3.5" />
                    {overview.failed} failed message
                    {overview.failed !== 1 ? "s" : ""}
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

const OverviewCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-xl font-semibold tracking-tight text-slate-950">
          {value}
        </div>

        <div className="mt-0.5 text-xs text-slate-500">
          {label}
        </div>
      </div>
    </div>
  );
};

const MetricValue = ({
  value,
  icon,
}: {
  value: number;
  icon: React.ReactNode;
}) => {
  return (
    <span className="inline-flex items-center justify-end gap-1.5 font-medium text-slate-700">
      <span className="text-slate-400">{icon}</span>
      {value.toLocaleString()}
    </span>
  );
};

const EmptyState = ({
  status,
  onCreate,
}: {
  status: string;
  onCreate: () => void;
}) => {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff1eb] text-[#ff5a1f]">
        {status === "FAILED" ? (
          <FileWarning className="h-5 w-5" />
        ) : status === "SCHEDULED" ? (
          <Clock3 className="h-5 w-5" />
        ) : (
          <Megaphone className="h-5 w-5" />
        )}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        {status === "ALL"
          ? "No campaigns yet"
          : `No ${status.toLowerCase()} campaigns`}
      </h3>

      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
        {status === "ALL"
          ? "Create your first WhatsApp campaign and start reaching your opted-in contacts."
          : "There are no campaigns matching this status right now."}
      </p>

      {status === "ALL" && (
        <Button
          onClick={onCreate}
          className="mt-5 gap-2 bg-[#ff5a1f] hover:bg-[#e94f18]"
        >
          <Plus className="h-4 w-4" />
          Create campaign
        </Button>
      )}
    </div>
  );
};

export default WhatsAppCampaignsPage;
