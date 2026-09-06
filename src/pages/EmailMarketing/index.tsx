import { FeatureGate } from "@/components/subscription/FeatureGate";
import { FEATURE } from "@/constants/subscription.constant";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuthStore } from "@/stores";
import { useEffect } from "react";
import { Mail, MousePointerClick, Eye, Send, Ban, UserMinus } from "lucide-react";
import { StatCard } from "@/components/email/StatCard";
import { EmailTrendsChart } from "@/components/email/EmailTrendsChart";
import { useEmailMarketingStore } from "./store/email-marketing.store";
import { Link } from "react-router-dom";
import { EMAIL_MARKETING_PATHS } from "@/constants/routes";
import DataLoader from "@/components/Loader/data-loader";

const EmailMarketingOverview = () => {
  const { accountId } = useAuthStore();
  const { overview, fetchOverview, loading } = useEmailMarketingStore();
  const { usage, limits } = useSubscription();

  useEffect(() => {
    if (accountId) void fetchOverview(String(accountId));
  }, [accountId, fetchOverview]);

  const rates = overview?.rates || {};
  const emailUsage = Number((usage as any)?.emails || 0);
  const emailLimit = Number((limits as any)?.emailsPerMonth || 0);

  return (
    <FeatureGate feature={FEATURE.EMAIL_MARKETING}>
      {loading && !overview ? (
        <DataLoader className="h-[calc(100vh-220px)]" />
      ) : (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Email Marketing</h1>
          <p className="text-sm text-muted-foreground">
            Track campaign performance and engagement across your contacts.
          </p>
        </div>

        {emailLimit > 0 && (
          <div className="rounded-lg border p-4 text-sm">
            Email usage this period: {emailUsage.toLocaleString()} / {emailLimit.toLocaleString()}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard title="Emails Sent" value={String(overview?.sentCount || 0)} subtitle="All campaigns" icon={Send} />
          <StatCard title="Delivered" value={String(overview?.deliveredCount || 0)} subtitle={`${rates.deliveryRate || 0}%`} icon={Mail} />
          <StatCard title="Open Rate" value={`${rates.openRate || 0}%`} subtitle="Unique opens" icon={Eye} />
          <StatCard title="Click Rate" value={`${rates.clickRate || 0}%`} subtitle="Unique clicks" icon={MousePointerClick} />
          <StatCard title="Bounce Rate" value={`${rates.bounceRate || 0}%`} subtitle="Hard bounces" icon={Ban} />
          <StatCard title="Unsubscribe" value={`${rates.unsubscribeRate || 0}%`} subtitle="Of delivered" icon={UserMinus} />
        </div>

        <EmailTrendsChart data={overview?.trends} series={overview?.series} />

        <div className="rounded-lg border">
          <div className="p-4 font-medium">Top campaigns</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t text-left text-muted-foreground">
                <th className="p-3">Campaign</th>
                <th className="p-3">Open</th>
                <th className="p-3">Click</th>
                <th className="p-3">Delivery</th>
              </tr>
            </thead>
            <tbody>
              {(overview?.comparison || []).map((row: any) => (
                <tr key={row.id} className="border-t">
                  <td className="p-3">
                    <Link
                      className="text-primary"
                      to={EMAIL_MARKETING_PATHS.campaign(String(accountId), row.id)}
                    >
                      {row.name}
                    </Link>
                  </td>
                  <td className="p-3">{row.openRate}%</td>
                  <td className="p-3">{row.clickRate}%</td>
                  <td className="p-3">{row.deliveryRate}%</td>
                </tr>
              ))}
              {!loading && !(overview?.comparison || []).length && (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={4}>
                    No campaigns yet. Create one to see performance here.
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

export default EmailMarketingOverview;
