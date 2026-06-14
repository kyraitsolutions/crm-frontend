import { BusinessCard } from "../components/cards/BusinessCard";
import { ConnectionStatusCard } from "../components/cards/ConnectionStatusCard";
import { PhoneNumberCard } from "../components/cards/PhoneNumberCard";
import { QuickStats } from "../components/QuickStats";

interface OverviewTabProps {
  data: any;
}

export const OverviewTab = ({ data }: OverviewTabProps) => {
  return (
    <div className="space-y-3">
      <QuickStats data={data} />

      <div className="grid gap-1 lg:grid-cols-3">
        <ConnectionStatusCard
          connected={data.isConnected}
          onboardingCompleted={data.onboardingCompleted}
          webhookSubscribed={data.webhookSubscribed}
          officialBusiness={data.phoneNumberInfo.isOfficialBusinessAccount}
        />

        <PhoneNumberCard data={data.phoneNumberInfo} />
        <BusinessCard
          data={{
            businessInfo: data.businessInfo,
            wabaInfo: data.wabaInfo,
          }}
        />
      </div>
    </div>
  );
};
