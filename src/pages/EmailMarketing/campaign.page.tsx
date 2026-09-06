import { FeatureGate } from "@/components/subscription/FeatureGate";
import { FEATURE } from "@/constants/subscription.constant";
import { EMAIL_MARKETING_PATHS } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useEmailMarketingStore } from "./store/email-marketing.store";
import { Plus } from "lucide-react";
import DataLoader from "@/components/Loader/data-loader";

const filters = ["ALL", "DRAFT", "SCHEDULED", "SENDING", "COMPLETED", "FAILED"];

const CampaignsPage = () => {
  const { accountId } = useAuthStore();
  const { campaigns, fetchCampaigns, loading } = useEmailMarketingStore();
  const [status, setStatus] = useState("ALL");
  const base = EMAIL_MARKETING_PATHS.base(String(accountId));

  useEffect(() => {
    if (accountId) void fetchCampaigns(String(accountId), status);
  }, [accountId, status, fetchCampaigns]);

  return (
    <FeatureGate feature={FEATURE.EMAIL_MARKETING}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Campaigns</h1>
            <p className="text-sm text-muted-foreground">Create, schedule, and measure email campaigns.</p>
          </div>
          <Button asChild>
            <Link to={EMAIL_MARKETING_PATHS.createCampaign(String(accountId))}>
              <Plus className="h-4 w-4" /> New campaign
            </Link>
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={status === item ? "default" : "outline"}
              onClick={() => setStatus(item)}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="rounded-lg border overflow-x-auto">
          {loading ? (
            <DataLoader className="h-64" />
          ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b">
                <th className="p-3">Campaign</th>
                <th className="p-3">Status</th>
                <th className="p-3">Audience</th>
                <th className="p-3">Sent</th>
                <th className="p-3">Delivered</th>
                <th className="p-3">Opened</th>
                <th className="p-3">Clicked</th>
                <th className="p-3">Unsubscribed</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b">
                  <td className="p-3">
                    <Link className="text-primary font-medium" to={`${base}/campaigns/${campaign.id}`}>
                      {campaign.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">{campaign.subject}</div>
                  </td>
                  <td className="p-3">{campaign.status}</td>
                  <td className="p-3">{campaign.totalRecipients || campaign.eligibleCount || 0}</td>
                  <td className="p-3">{campaign.sentCount || 0}</td>
                  <td className="p-3">{campaign.deliveredCount || 0}</td>
                  <td className="p-3">{campaign.rates?.openRate ?? 0}%</td>
                  <td className="p-3">{campaign.rates?.clickRate ?? 0}%</td>
                  <td className="p-3">{campaign.unsubscribedCount || 0}</td>
                </tr>
              ))}
              {!loading && campaigns.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-muted-foreground">
                    No campaigns in this filter yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </FeatureGate>
  );
};

export default CampaignsPage;
