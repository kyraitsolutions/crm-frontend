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
            <h1 className="text-2xl font-bold">WhatsApp Marketing</h1>
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

          <div className="rounded-lg border">
            <div className="p-4 font-medium">Top campaigns</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t text-left text-muted-foreground">
                  <th className="p-3">Campaign</th>
                  <th className="p-3">Read</th>
                  <th className="p-3">Reply</th>
                  <th className="p-3">Delivery</th>
                </tr>
              </thead>
              <tbody>
                {(overview?.comparison || []).map((row: any) => (
                  <tr key={row.id} className="border-t">
                    <td className="p-3">
                      <Link
                        className="text-primary"
                        to={WHATSAPP_MARKETING_PATHS.campaign(String(accountId), row.id)}
                      >
                        {row.name}
                      </Link>
                    </td>
                    <td className="p-3">{row.readRate}%</td>
                    <td className="p-3">{row.replyRate}%</td>
                    <td className="p-3">{row.deliveryRate}%</td>
                  </tr>
                ))}
                {!loading && !(overview?.comparison || []).length && (
                  <tr>
                    <td className="p-3 text-muted-foreground" colSpan={4}>
                      No campaigns yet. Select contacts and broadcast on WhatsApp to see performance here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </FeatureGate>
  );
};

export default WhatsappMarketingOverview;
