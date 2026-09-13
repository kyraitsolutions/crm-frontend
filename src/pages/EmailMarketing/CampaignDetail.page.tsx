import { FeatureGate } from "@/components/subscription/FeatureGate";
import { FEATURE } from "@/constants/subscription.constant";
import { useAuthStore } from "@/stores";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { emailMarketingService } from "./services/email-marketing.service";
import { StatCard } from "@/components/email/StatCard";
import { Eye, Mail, MousePointerClick, Send, Ban, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastMessageService } from "@/services";
import DataLoader from "@/components/Loader/data-loader";

const CampaignDetailPage = () => {
  const { campaignId } = useParams();
  const { accountId } = useAuthStore();
  const toast = new ToastMessageService();
  const [data, setData] = useState<any>(null);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [status, setStatus] = useState("ALL");
  const [testTo, setTestTo] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!accountId || !campaignId) return;
    setLoading(true);
    try {
      const analytics = await emailMarketingService.analytics(String(accountId), campaignId);
      setData(analytics.data?.doc);
      const list = await emailMarketingService.recipients(String(accountId), campaignId, {
        status: status === "ALL" ? undefined : status,
      });
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

  return (
    <FeatureGate feature={FEATURE.EMAIL_MARKETING}>
      {loading && !data ? (
        <DataLoader className="h-[calc(100vh-220px)]" />
      ) : (
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{campaign?.name || "Campaign"}</h1>
            <p className="text-sm text-muted-foreground">{campaign?.status}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Input placeholder="Send test to" value={testTo} onChange={(e) => setTestTo(e.target.value)} />
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await emailMarketingService.test(String(accountId), String(campaignId), testTo);
                  toast.success("Test email sent (not counted in analytics)");
                } catch (error: any) {
                  toast.error(error?.message || "Test send failed");
                }
              }}
            >
              Send test
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard title="Recipients" value={String(campaign?.totalRecipients || 0)} subtitle="Snapshot" icon={Mail} />
          <StatCard title="Delivered" value={String(campaign?.deliveredCount || 0)} subtitle={`${rates.deliveryRate || 0}%`} icon={Send} />
          <StatCard title="Open rate" value={`${rates.openRate || 0}%`} subtitle="Unique" icon={Eye} />
          <StatCard title="Click rate" value={`${rates.clickRate || 0}%`} subtitle="Unique" icon={MousePointerClick} />
          <StatCard title="Bounce" value={`${rates.bounceRate || 0}%`} subtitle={`${campaign?.bouncedCount || 0}`} icon={Ban} />
          <StatCard title="Unsubscribed" value={`${rates.unsubscribeRate || 0}%`} subtitle={`${campaign?.unsubscribedCount || 0}`} icon={UserMinus} />
        </div>

        <div>
          <h2 className="font-medium mb-2">Top links</h2>
          <ul className="text-sm space-y-1">
            {(data?.topLinks || []).map((link: any) => (
              <li key={link.url} className="truncate">
                {link.clicks} · {link.url}
              </li>
            ))}
            {!(data?.topLinks || []).length && (
              <li className="text-muted-foreground">No clicks yet.</li>
            )}
          </ul>
        </div>

        <div>
          <div className="flex gap-2 mb-2">
            {["ALL", "DELIVERED", "OPENED", "CLICKED", "BOUNCED", "UNSUBSCRIBED"].map((item) => (
              <Button key={item} size="sm" variant={status === item ? "default" : "outline"} onClick={() => setStatus(item)}>
                {item}
              </Button>
            ))}
          </div>
          <table className="w-full text-sm border rounded">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Email</th>
                <th className="p-2">Status</th>
                <th className="p-2">Opened</th>
                <th className="p-2">Clicked</th>
              </tr>
            </thead>
            <tbody>
              {recipients.map((row) => (
                <tr key={row.id} className="border-b">
                  <td className="p-2">{row.email}</td>
                  <td className="p-2">{row.status}</td>
                  <td className="p-2">{row.openedAt ? "Yes" : "—"}</td>
                  <td className="p-2">{row.clickedAt ? "Yes" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </FeatureGate>
  );
};

export default CampaignDetailPage;
