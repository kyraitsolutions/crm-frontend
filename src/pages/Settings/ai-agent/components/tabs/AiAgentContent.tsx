import { useAiAgentStudioStore } from "../../store/ai-agent.store";
import ActionsSection from "../sections/ActionsSection";
import IdentitySection from "../sections/IdentitySection";
import KnowledgeSection from "../sections/KnowledgeSection";
import SettingsSection from "../sections/SettingsSection";
import SkillsSection from "../sections/SkillsSection";
import VoiceSection from "../sections/VoiceSection";

const AiAgentContent = () => {
  const activeTab = useAiAgentStudioStore((state) => state.activeTab);

  if (activeTab === "voice") return <VoiceSection />;
  if (activeTab === "skills") return <SkillsSection />;
  if (activeTab === "knowledge") return <KnowledgeSection />;
  if (activeTab === "actions") return <ActionsSection />;
  if (activeTab === "settings") return <SettingsSection />;
  return <IdentitySection />;
};

export default AiAgentContent;
