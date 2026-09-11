import { FeatureGate } from "@/components/subscription/FeatureGate";
import { FEATURE } from "@/constants/subscription.constant";
import { useAuthStore } from "@/stores";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { whatsappBroadcastService } from "./services/whatsapp-broadcast.service";
import {
  Ban,
  CheckCheck,
  ChevronLeft,
  Clock3,
  Eye,
  MessageCircle,
  RefreshCw,
  Send,
  UserMinus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToastMessageService } from "@/services";
import DataLoader from "@/components/Loader/data-loader";
import { getInitials } from "./utils/getInitials";

const recipientFilters = [
  { value: "ALL", label: "All" },
  { value: "SENT", label: "Sent" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "READ", label: "Read" },
  { value: "FAILED", label: "Failed" },
  { value: "OPTED_OUT", label: "Opted out" },
];

const statusStyles: Record<
  string,
  { label: string; className: string; dot: string }
> = {
  SENT: {
    label: "Sent",
    className: "bg-blue-50 text-blue-700 border-blue-100",
    dot: "bg-blue-500",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dot: "bg-emerald-500",
  },
  READ: {
    label: "Read",
    className: "bg-violet-50 text-violet-700 border-violet-100",
    dot: "bg-violet-500",
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-50 text-red-700 border-red-100",
    dot: "bg-red-500",
  },
  OPTED_OUT: {
    label: "Opted out",
    className: "bg-amber-50 text-amber-700 border-amber-100",
    dot: "bg-amber-500",
  },
};

const campaignStatusStyles: Record<
  string,
  { className: string; dot: string }
> = {
  COMPLETED: {
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dot: "bg-emerald-500",
  },
  FAILED: {
    className: "bg-red-50 text-red-700 border-red-100",
    dot: "bg-red-500",
  },
  SENDING: {
    className: "bg-blue-50 text-blue-700 border-blue-100",
    dot: "bg-blue-500",
  },
  SCHEDULED: {
    className: "bg-violet-50 text-violet-700 border-violet-100",
    dot: "bg-violet-500",
  },
  DRAFT: {
    className: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
};

const WhatsAppCampaignDetailPage = () => {
  const { campaignId } = useParams();
  const { accountId } = useAuthStore();
  const navigate = useNavigate();

  const toast = new ToastMessageService();

  const [data, setData] = useState<any>(null);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);

  const load = async () => {
    if (!accountId || !campaignId) return;

    setLoading(true);

    try {
      const analytics = await whatsappBroadcastService.analytics(
        String(accountId),
        campaignId,
      );

      setData(analytics.data?.doc);

      const list = await whatsappBroadcastService.recipients(
        String(accountId),
        campaignId,
        {
          status: status === "ALL" ? undefined : status,
        },
      );

      setRecipients(list.data?.docs || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [accountId, campaignId, status]);

  const campaign = data?.campaign;
  const rates = campaign?.rates || {};

  const getCampaignStatus = () => {
    return (
      campaignStatusStyles[campaign?.status] || {
        className: "bg-slate-100 text-slate-600 border-slate-200",
        dot: "bg-slate-400",
      }
    );
  };

  const getRecipientStatus = (recipientStatus: string) => {
    return (
      statusStyles[recipientStatus] || {
        label: recipientStatus,
        className: "bg-slate-100 text-slate-600 border-slate-200",
        dot: "bg-slate-400",
      }
    );
  };

  const handleResend = async () => {
    if (!accountId || !campaignId) return;

    try {
      setResending(true);

      await whatsappBroadcastService.resend(
        String(accountId),
        String(campaignId),
      );

      toast.success("Resend queued for failed recipients");

      await load();
    } catch (error: any) {
      toast.error(error?.message || "Resend failed");
    } finally {
      setResending(false);
    }
  };

  return (
    <FeatureGate feature={FEATURE.WHATSAPP_MESSAGING}>
      {loading && !data ? (
        <div className="flex h-[calc(100vh-120px)] items-center justify-center">
          <DataLoader className="h-64" />
        </div>
      ) : (
        <div className="min-h-full bg-[#f8fafc]">
          <div className="mx-auto max-w-[1600px] space-y-5 p-5 lg:p-6">

            {/* ------------------------------------------------
                HEADER
            ------------------------------------------------ */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Campaigns
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0ea]">
                    <MessageCircle className="h-5 w-5 text-[#ff5a1f]" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="truncate text-xl font-semibold tracking-tight text-slate-950">
                        {campaign?.name || "Campaign"}
                      </h1>

                      {campaign?.status && (
                        <CampaignStatusBadge
                          status={campaign.status}
                          config={getCampaignStatus()}
                        />
                      )}
                    </div>

                    <p className="mt-0.5 text-sm text-slate-500">
                      WhatsApp campaign
                      {campaign?.templateName
                        ? ` · ${campaign.templateName}`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>

              {["COMPLETED", "FAILED"].includes(campaign?.status) && (
                <Button
                  disabled={resending}
                  onClick={handleResend}
                  variant="outline"
                  className="h-9 gap-2 border-slate-200 bg-white px-3.5 text-sm shadow-sm hover:bg-slate-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${resending ? "animate-spin" : ""
                      }`}
                  />
                  {resending ? "Resending..." : "Resend campaign"}
                </Button>
              )}
            </div>

            {/* ------------------------------------------------
                CAMPAIGN SUMMARY
            ------------------------------------------------ */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              <CampaignStat
                title="Recipients"
                value={campaign?.totalRecipients || 0}
                subtitle="Eligible contacts"
                icon={Users}
                iconClass="bg-emerald-50 text-emerald-600"
              />

              <CampaignStat
                title="Delivered"
                value={campaign?.deliveredCount || 0}
                subtitle={`${rates.deliveryRate || 0}% delivery rate`}
                icon={CheckCheck}
                iconClass="bg-blue-50 text-blue-600"
              />

              <CampaignStat
                title="Read"
                value={campaign?.readCount || 0}
                subtitle={`${rates.readRate || 0}% read rate`}
                icon={Eye}
                iconClass="bg-violet-50 text-violet-600"
              />

              <CampaignStat
                title="Replies"
                value={campaign?.repliedCount || 0}
                subtitle={`${rates.replyRate || 0}% reply rate`}
                icon={MessageCircle}
                iconClass="bg-cyan-50 text-cyan-600"
              />

              <CampaignStat
                title="Failed"
                value={campaign?.failedCount || 0}
                subtitle={`${rates.failRate || 0}% failure rate`}
                icon={Ban}
                iconClass="bg-red-50 text-red-600"
              />

              <CampaignStat
                title="Opted out"
                value={campaign?.optedOutCount || 0}
                subtitle={`${rates.optOutRate || 0}% opt-out rate`}
                icon={UserMinus}
                iconClass="bg-amber-50 text-amber-600"
              />
            </div>

            {/* ------------------------------------------------
                RECIPIENTS
            ------------------------------------------------ */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              {/* Section Header */}
              <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Recipients
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      View message delivery and engagement status.
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="flex max-w-full gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1">
                    {recipientFilters.map((item) => {
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

              {/* Recipient Table */}
              {loading ? (
                <div className="flex h-72 items-center justify-center">
                  <DataLoader className="h-52" />
                </div>
              ) : recipients.length === 0 ? (
                <EmptyRecipients status={status} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-sm">

                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/70">
                        <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          Contact
                        </th>

                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          Phone
                        </th>

                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          Status
                        </th>

                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          Read
                        </th>

                        <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          Replied
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {recipients.map((row) => {
                        const recipientStatus = getRecipientStatus(
                          row.status,
                        );

                        return (
                          <tr
                            key={row.id}
                            className="transition-colors hover:bg-slate-50/70"
                          >
                            {/* Contact */}
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                                  {getInitials(row.name)}
                                </div>

                                <div className="font-medium text-slate-900">
                                  {row.name || "Unknown contact"}
                                </div>
                              </div>
                            </td>

                            {/* Phone */}
                            <td className="px-4 py-3.5 font-mono text-xs text-slate-600">
                              {row.phone}
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3.5">
                              <span
                                className={[
                                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                                  recipientStatus.className,
                                ].join(" ")}
                              >
                                <span
                                  className={[
                                    "h-1.5 w-1.5 rounded-full",
                                    recipientStatus.dot,
                                  ].join(" ")}
                                />

                                {recipientStatus.label}
                              </span>
                            </td>

                            {/* Read */}
                            <td className="px-4 py-3.5">
                              {row.readAt ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                                  <CheckCheck className="h-3.5 w-3.5" />
                                  Read
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400">
                                  —
                                </span>
                              )}
                            </td>

                            {/* Replied */}
                            <td className="px-5 py-3.5">
                              {row.repliedAt ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600">
                                  <MessageCircle className="h-3.5 w-3.5" />
                                  Replied
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400">
                                  —
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Footer */}
              {!loading && recipients.length > 0 && (
                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-5 py-3">
                  <span className="text-xs text-slate-500">
                    Showing {recipients.length} recipient
                    {recipients.length !== 1 ? "s" : ""}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock3 className="h-3.5 w-3.5" />
                    Delivery status updates automatically
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </FeatureGate>
  );
};

/* ================================================================
   STAT CARD
================================================================ */

const CampaignStat = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
}: {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ElementType;
  iconClass: string;
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={[
            "flex h-9 w-9 items-center justify-center rounded-full",
            iconClass,
          ].join(" ")}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-xl font-semibold tracking-tight text-slate-950">
          {Number(value).toLocaleString()}
        </div>

        <div className="mt-0.5 text-xs font-medium text-slate-700">
          {title}
        </div>

        <div className="mt-1 text-[11px] text-slate-400">
          {subtitle}
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   CAMPAIGN STATUS
================================================================ */

const CampaignStatusBadge = ({
  status,
  config,
}: {
  status: string;
  config: {
    className: string;
    dot: string;
  };
}) => {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        config.className,
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          config.dot,
        ].join(" ")}
      />

      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
};

/* ================================================================
   EMPTY STATE
================================================================ */

const EmptyRecipients = ({ status }: { status: string }) => {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <Users className="h-5 w-5" />
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-900">
        No recipients found
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
        There are no recipients matching the{" "}
        <span className="font-medium text-slate-700">
          {status.toLowerCase()}
        </span>{" "}
        filter for this campaign.
      </p>
    </div>
  );
};


export default WhatsAppCampaignDetailPage;