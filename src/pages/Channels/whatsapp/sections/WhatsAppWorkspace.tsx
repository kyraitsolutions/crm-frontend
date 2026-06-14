import { useIntegrationStore } from "@/stores/integration.store";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import { useWhatsAppStore } from "../store/whatsapp.store";
import { OverviewTab } from "../tabs/OverviewTab";
import { SettingsTab } from "../tabs/SettingsTabs";
import { Tabs } from "../tabs/Tabs";
import type { TWhatsAppAccount } from "../types/whatsapp.type";

const WhatsAppWorkspace = () => {
  const { activeTab } = useWhatsAppStore((state) => state);
  const { integration } = useIntegrationStore((state) => state);

  const whatsappAccountData = integration?.data as TWhatsAppAccount;

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab data={whatsappAccountData} />;

      case "settings":
        return <SettingsTab data={whatsappAccountData} />;

      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-3">
      <WorkspaceHeader
        businessName={whatsappAccountData?.businessInfo.name}
        phoneNumber={whatsappAccountData?.phoneNumberInfo.displayPhoneNumber}
      />

      <Tabs />

      {renderTab()}
    </div>
  );
};

export default WhatsAppWorkspace;
