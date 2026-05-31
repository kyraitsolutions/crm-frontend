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
      {/* <ConfigurationHeader /> */}

      <div className="flex">
        {/* LEFT SIDEBAR */}
        <div className="max-w-56 w-full border-r p-4">
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
