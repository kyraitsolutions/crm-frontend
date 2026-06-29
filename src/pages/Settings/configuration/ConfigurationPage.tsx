import { useEffect } from "react";
import ConfigurationContent from "./components/tabs/ConfigurationContent";
import ConfigurationTabs from "./components/tabs/ConfigurationTabs";
import { useConfigurationStore } from "./store/configuration.store";

const ConfigurationPage = () => {
  const { getConfigurations, activeTab } = useConfigurationStore(
    (state) => state,
  );

  useEffect(() => {
    getConfigurations();
  }, [activeTab]);
  return (
    <div>
      <div className="flex h-f">
        {/* LEFT SIDEBAR */}
        <div className="max-w-56 w-full p-4 h-[calc(100vh-64px)] shadow-lg">
          <ConfigurationTabs />
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 p-4">
          <ConfigurationContent />
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPage;
