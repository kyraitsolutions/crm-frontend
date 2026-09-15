import { ConnectionStatusCard } from "../components/cards/ConnectionStatusCard";
import { FacebookPageCard } from "../components/cards/FacebookPageCard";
import { InstagramCard } from "../components/cards/InstagramCard";
import { QuickStats } from "../components/QuickStats";
import type { TMetaAccount } from "../types/meta.type";

interface OverviewTabProps {
  data: TMetaAccount;
}

export const OverviewTab = ({ data }: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      <QuickStats data={data} />

      <div className="grid gap-4 lg:grid-cols-3">
        <ConnectionStatusCard
          connected={data?.isConnected}
          onboardingCompleted={data?.onboardingCompleted}
          webhookSubscribed={data?.webhookSubscribed}
        />

        <FacebookPageCard data={data?.facebookPage} />
        <InstagramCard data={data?.instagram} />
      </div>

      {data?.facebookPage?.about || data?.facebookPage?.description ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-2">
          <h3 className="font-semibold text-slate-800">Page About</h3>
          <p className="text-sm text-slate-600">
            {data.facebookPage.about || data.facebookPage.description}
          </p>
        </div>
      ) : null}
    </div>
  );
};
