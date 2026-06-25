import clsx from "clsx";

import { CONFIGURATION_TABS } from "../../constants/configuration.constants";

import { useConfigurationStore } from "../../store/configuration.store";

const ConfigurationTabs = () => {
  const activeTab = useConfigurationStore((state) => state.activeTab);
  const setActiveTab = useConfigurationStore((state) => state.setActiveTab);

  return (
    <div className="space-y-3 ">
      {/* <div className="px-3 border-b pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
          CRM Configuration
        </h2>
      </div> */}

      <div className="space-y-1">
        {CONFIGURATION_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              "flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium transition-all",

              activeTab === tab.key
                ? "bg-primary/80 text-white"
                : "text-[#4B5563] hover:bg-[#F3F4F6]",
            )}
          >
            {/* Icon */}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConfigurationTabs;
