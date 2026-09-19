import { OverviewTab } from "../tabs/OverviewTab";
import { FacebookPageShell } from "../components/FacebookPageShell";
import { useActiveFacebookPage } from "../utils/pages";

const MetaWorkspace = () => {
  const { metaAccount } = useActiveFacebookPage();

  if (!metaAccount) {
    return <div className="p-6 text-sm text-slate-500">Meta account not found</div>;
  }

  return (
    <FacebookPageShell>
      <OverviewTab data={metaAccount} />
    </FacebookPageShell>
  );
};

export default MetaWorkspace;
