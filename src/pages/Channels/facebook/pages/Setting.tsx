import { useIntegrationStore } from "@/stores/integration.store";
import { SettingsTab } from "../tabs/SettingsTab";
import type { TMetaAccount } from "../types/meta.type";
import { WorkspaceHeader } from "../components/WorkspaceHeader";

const Setting = () => {
  const { integration } = useIntegrationStore((state) => state);
  const metaAccountData = integration?.data as TMetaAccount;

  if (!metaAccountData) return <div>Facebook account not found</div>;

  return (
    <div className="space-y-4 px-4 py-2">
      <WorkspaceHeader
        pageName={metaAccountData?.facebookPage?.name}
        category={metaAccountData?.facebookPage?.category}
        instagramUsername={metaAccountData?.instagram?.username}
      />

      <SettingsTab />
    </div>
  );
};

export default Setting;
