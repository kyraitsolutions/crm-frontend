import { useConfigurationStore } from "../../store/configuration.store";
import AutomationSection from "../sections/AutomationSection";
import ConversationStatusSection from "../sections/ConversationStatusSection";
import LeadStatusSection from "../sections/LeadStatusSection";

const ConfigurationContent = () => {
  const activeTab = useConfigurationStore((state) => state.activeTab);

  switch (activeTab) {
    case "lead-status":
      return <LeadStatusSection />;

    case "conversation-status":
      return <ConversationStatusSection />;

    case "automation-pipeline":
      return <AutomationSection />;

    default:
      return null;
  }
};

export default ConfigurationContent;
