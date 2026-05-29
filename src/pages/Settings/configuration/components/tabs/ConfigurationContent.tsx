import { useConfigurationStore } from "../../store/configuration.store";
import ConversationStatusSection from "../sections/ConversationStatusSection";
import LeadStatusSection from "../sections/LeadStatusSection";

const ConfigurationContent = () => {
  const activeTab = useConfigurationStore((state) => state.activeTab);

  switch (activeTab) {
    case "lead-status":
      return <LeadStatusSection />;

    case "conversation-status":
      return <ConversationStatusSection />;

    default:
      return null;
  }
};

export default ConfigurationContent;
