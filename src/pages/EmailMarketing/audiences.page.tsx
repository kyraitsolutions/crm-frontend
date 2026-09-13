import { FeatureGate } from "@/components/subscription/FeatureGate";
import { FEATURE } from "@/constants/subscription.constant";
import { useAuthStore } from "@/stores";
import { useEffect, useState } from "react";
import { emailMarketingService } from "./services/email-marketing.service";
import DataLoader from "@/components/Loader/data-loader";

const AudiencesPage = () => {
  const { accountId } = useAuthStore();
  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accountId) return;
    setLoading(true);
    void emailMarketingService
      .previewAudience(String(accountId), { mode: "all", filters: {} })
      .then((res) => setPreview(res.data?.doc))
      .finally(() => setLoading(false));
  }, [accountId]);

  return (
    <FeatureGate feature={FEATURE.EMAIL_MARKETING}>
      {loading && !preview ? (
        <DataLoader className="h-[calc(100vh-220px)]" />
      ) : (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Audiences</h1>
        <p className="text-sm text-muted-foreground">
          Email marketing uses your contacts. Audience is filtered by source and subscription status.
        </p>
        {preview && (
          <div className="grid grid-cols-3 gap-4">
            <div className="border rounded p-4">All contacts with email<br /><b>{preview.audience}</b></div>
            <div className="border rounded p-4">Eligible<br /><b>{preview.eligible}</b></div>
            <div className="border rounded p-4">Excluded<br /><b>{preview.excluded}</b></div>
          </div>
        )}
      </div>
      )}
    </FeatureGate>
  );
};

export default AudiencesPage;
