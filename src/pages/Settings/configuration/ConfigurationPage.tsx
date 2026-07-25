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
      <div className="flex h-f bg-gray-50">
        {/* LEFT SIDEBAR */}
        <div className="max-w-80 w-full px-4 py-10 h-[calc(100vh-64px)] bg-white">
          <ConfigurationTabs />
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 p-4 max-w-7xl mx-auto py-10  h-[calc(100vh-114px)] overflow-y-scroll hide-scrollbar">
          <ConfigurationContent />
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPage;
