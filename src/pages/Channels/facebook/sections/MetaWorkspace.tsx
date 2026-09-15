import { useIntegrationStore } from "@/stores/integration.store";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import { OverviewTab } from "../tabs/OverviewTab";
import type { TMetaAccount } from "../types/meta.type";

const MetaWorkspace = () => {
  const { integration } = useIntegrationStore((state) => state);
  const metaAccountData = integration?.data as TMetaAccount;

  if (!metaAccountData) {
    return <div className="p-6 text-sm text-slate-500">Meta account not found</div>;
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-4 py-2">
      <WorkspaceHeader
        pageName={metaAccountData?.facebookPage?.name}
        category={metaAccountData?.facebookPage?.category}
        instagramUsername={metaAccountData?.instagram?.username}
      />

      <OverviewTab data={metaAccountData} />
    </div>
  );
};

export default MetaWorkspace;
