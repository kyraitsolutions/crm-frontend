import { FeatureGate } from "@/components/subscription/FeatureGate";
import { FEATURE } from "@/constants/subscription.constant";
import { useAuthStore } from "@/stores";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { whatsappBroadcastService } from "./services/whatsapp-broadcast.service";
import { StatCard } from "@/components/email/StatCard";
import { Eye, MessageCircle, Send, Ban, UserMinus, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToastMessageService } from "@/services";
import DataLoader from "@/components/Loader/data-loader";

const WhatsAppCampaignDetailPage = () => {
  const { campaignId } = useParams();
  const { accountId } = useAuthStore();
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
      const analytics = await whatsappBroadcastService.analytics(String(accountId), campaignId);
      setData(analytics.data?.doc);
      const list = await whatsappBroadcastService.recipients(String(accountId), campaignId, {
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
    <FeatureGate feature={FEATURE.WHATSAPP_MESSAGING}>
      {loading && !data ? (
        <DataLoader className="h-[calc(100vh-220px)]" />
      ) : (
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{campaign?.name || "Campaign"}</h1>
              <p className="text-sm text-muted-foreground">
                {campaign?.status} · {campaign?.templateName}
              </p>
            </div>
            {["COMPLETED", "FAILED"].includes(campaign?.status) && (
              <Button
                disabled={resending}
                onClick={async () => {
                  try {
                    setResending(true);
                    await whatsappBroadcastService.resend(String(accountId), String(campaignId));
                    toast.success("Resend queued for failed recipients");
                    await load();
                  } catch (error: any) {
                    toast.error(error?.message || "Resend failed");
                  } finally {
                    setResending(false);
                  }
                }}
              >
                Resend campaign
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard title="Recipients" value={String(campaign?.totalRecipients || 0)} subtitle="Eligible" icon={Send} />
            <StatCard title="Delivered" value={String(campaign?.deliveredCount || 0)} subtitle={`${rates.deliveryRate || 0}%`} icon={CheckCheck} />
            <StatCard title="Read rate" value={`${rates.readRate || 0}%`} subtitle={`${campaign?.readCount || 0}`} icon={Eye} />
            <StatCard title="Replies" value={String(campaign?.repliedCount || 0)} subtitle={`${rates.replyRate || 0}%`} icon={MessageCircle} />
            <StatCard title="Failed" value={String(campaign?.failedCount || 0)} subtitle={`${rates.failRate || 0}%`} icon={Ban} />
            <StatCard title="Opted out" value={String(campaign?.optedOutCount || 0)} subtitle={`${rates.optOutRate || 0}%`} icon={UserMinus} />
          </div>

          <div>
            <div className="flex gap-2 mb-2 flex-wrap">
              {["ALL", "SENT", "DELIVERED", "READ", "FAILED", "OPTED_OUT"].map((item) => (
                <Button key={item} size="sm" variant={status === item ? "default" : "outline"} onClick={() => setStatus(item)}>
                  {item}
                </Button>
              ))}
            </div>
            <table className="w-full text-sm border rounded">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Phone</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Read</th>
                  <th className="p-2">Replied</th>
                </tr>
              </thead>
              <tbody>
                {recipients.map((row) => (
                  <tr key={row.id} className="border-b">
                    <td className="p-2">{row.phone}</td>
                    <td className="p-2">{row.name || "—"}</td>
                    <td className="p-2">{row.status}</td>
                    <td className="p-2">{row.readAt ? "Yes" : "—"}</td>
                    <td className="p-2">{row.repliedAt ? "Yes" : "—"}</td>
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

export default WhatsAppCampaignDetailPage;
