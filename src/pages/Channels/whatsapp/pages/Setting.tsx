import { useIntegrationStore } from "@/stores/integration.store";
import { SettingsTab } from "../tabs/SettingsTabs";
import type { TWhatsAppAccount } from "../types/whatsapp.type";
import { WorkspaceHeader } from "../components/WorkspaceHeader";

const Setting = () => {
  const { integration } = useIntegrationStore((state) => state);
  const whatsappAccountData = integration?.data as TWhatsAppAccount;

  return (
    <div className="space-y-4 px-4 py-2">
      <WorkspaceHeader
        businessName={whatsappAccountData?.businessInfo.name}
        phoneNumber={whatsappAccountData?.phoneNumberInfo.displayPhoneNumber}
      />

      <SettingsTab data={whatsappAccountData} />
    </div>
  );
};

export default Setting;
