import { SettingsTab } from "../tabs/SettingsTab";
import { FacebookPageShell } from "../components/FacebookPageShell";
import { useActiveFacebookPage } from "../utils/pages";

const Setting = () => {
  const { metaAccount } = useActiveFacebookPage();

  if (!metaAccount) return <div>Facebook account not found</div>;

  return (
    <FacebookPageShell>
      <SettingsTab />
    </FacebookPageShell>
  );
};

export default Setting;
