import { FeatureGate } from "@/components/subscription/FeatureGate";
import { FEATURE } from "@/constants/subscription.constant";
import { useAuthStore } from "@/stores";
import { useEffect } from "react";
import { Eye, MessageCircle, Send, Ban, UserMinus, CheckCheck } from "lucide-react";
import { StatCard } from "@/components/email/StatCard";
import { useWhatsAppMarketingStore } from "./store/whatsapp-marketing.store";
import { Link } from "react-router-dom";
import { WHATSAPP_MARKETING_PATHS } from "@/constants/routes/whatsapp-marketing.path";
import DataLoader from "@/components/Loader/data-loader";
import { WhatsAppTrendsChart } from "./components/WhatsAppTrendsChart";

const WhatsappMarketingOverview = () => {
  const { accountId } = useAuthStore();
  const { overview, fetchOverview, loading } = useWhatsAppMarketingStore();

  useEffect(() => {
    if (accountId) void fetchOverview(String(accountId));
  }, [accountId, fetchOverview]);

  const rates = overview?.rates || {};

  return (
    <FeatureGate feature={FEATURE.WHATSAPP_MESSAGING}>
      {loading && !overview ? (
        <DataLoader className="h-[calc(100vh-220px)]" />
      ) : (
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-xl font-bold">WhatsApp Marketing</h1>
            <p className="text-sm text-muted-foreground">
              Campaign delivery, reads, replies, and opt-outs across opted-in contacts.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard title="Messages Sent" value={String(overview?.sentCount || 0)} subtitle="All campaigns" icon={Send} />
            <StatCard title="Delivered" value={String(overview?.deliveredCount || 0)} subtitle={`${rates.deliveryRate || 0}%`} icon={CheckCheck} />
            <StatCard title="Read Rate" value={`${rates.readRate || 0}%`} subtitle="Unique reads" icon={Eye} />
            <StatCard title="Replies" value={String(overview?.repliedCount || 0)} subtitle={`${rates.replyRate || 0}%`} icon={MessageCircle} />
            <StatCard title="Failed" value={String(overview?.failedCount || 0)} subtitle={`${rates.failRate || 0}%`} icon={Ban} />
            <StatCard title="Opted out" value={String(overview?.optedOutCount || 0)} subtitle={`${rates.optOutRate || 0}%`} icon={UserMinus} />
          </div>

          <WhatsAppTrendsChart data={overview?.trends} />

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Top campaigns
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Campaigns with the best engagement and delivery performance.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <DataLoader className="h-32" />
              </div>
            ) : (overview?.comparison || []).length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70">
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Campaign
                      </th>

                      <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Read
                      </th>

                      <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Reply
                      </th>

                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Delivery
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {(overview?.comparison || []).map((row: any) => (
                      <tr
                        key={row.id}
                        className="group transition-colors hover:bg-slate-50/70"
                      >
                        {/* Campaign */}
                        <td className="px-5 py-3.5">
                          <Link
                            to={WHATSAPP_MARKETING_PATHS.campaign(
                              String(accountId),
                              row.id,
                            )}
                            className="flex items-center gap-3"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fff0ea] text-primary">
                              <MessageCircle className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-medium text-slate-800 transition-colors group-hover:text-primary">
                                {row.name}
                              </p>

                              <p className="mt-0.5 text-[11px] text-slate-400">
                                WhatsApp campaign
                              </p>
                            </div>
                          </Link>
                        </td>

                        {/* Read */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="inline-flex flex-col items-end">
                            <span className="font-semibold text-slate-800">
                              {row.readRate}%
                            </span>

                            <span className="mt-0.5 text-[10px] text-slate-400">
                              read rate
                            </span>
                          </div>
                        </td>

                        {/* Reply */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="inline-flex flex-col items-end">
                            <span className="font-semibold text-slate-800">
                              {row.replyRate}%
                            </span>

                            <span className="mt-0.5 text-[10px] text-slate-400">
                              reply rate
                            </span>
                          </div>
                        </td>

                        {/* Delivery */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="inline-flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{
                                  width: `${Math.min(
                                    Number(row.deliveryRate) || 0,
                                    100,
                                  )}%`,
                                }}
                              />
                            </div>

                            <span className="min-w-[42px] font-semibold text-slate-800">
                              {row.deliveryRate}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <MessageCircle className="h-5 w-5" />
                </div>

                <h4 className="mt-3 text-sm font-semibold text-slate-800">
                  No campaigns yet
                </h4>

                <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                  Create a WhatsApp campaign to start tracking delivery,
                  read and reply performance.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </FeatureGate>
  );
};

export default WhatsappMarketingOverview;
