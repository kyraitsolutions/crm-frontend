import { BusinessCard } from "../components/cards/BusinessCard";
import { ConnectionStatusCard } from "../components/cards/ConnectionStatusCard";
import { PhoneNumberCard } from "../components/cards/PhoneNumberCard";
import { QuickStats } from "../components/QuickStats";
import { WhatsAppAiAgentCard } from "@/components/subscription/WhatsAppAiAgentCard";

interface OverviewTabProps {
  data: any;
}

export const OverviewTab = ({ data }: OverviewTabProps) => {
  return (
    <div className="space-y-8">
      <QuickStats data={data} />

      <div className="grid gap-5 lg:grid-cols-3">
        <ConnectionStatusCard
          connected={data?.isConnected}
          onboardingCompleted={data?.onboardingCompleted}
          webhookSubscribed={data?.webhookSubscribed}
          officialBusiness={data?.phoneNumberInfo?.isOfficialBusinessAccount}
        />

        <PhoneNumberCard data={data?.phoneNumberInfo} />
        <BusinessCard
          data={{
            businessInfo: data?.businessInfo,
            wabaInfo: data?.wabaInfo,
          }}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-2">
          <h3 className="font-semibold text-slate-800">WhatsApp Messaging</h3>
          <p className="text-sm text-slate-600">
            Connect your WhatsApp account, send and receive messages, and manage
            conversations. Included in your plan, subject to monthly message limits.
          </p>
          <p className="text-xs text-green-700">Included</p>
        </div>
        <WhatsAppAiAgentCard />
      </div>
    </div>
  );
};
