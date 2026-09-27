import clsx from "clsx";
import { AI_AGENT_TABS } from "../../constants/ai-agent.constant";
import { useAiAgentStudioStore } from "../../store/ai-agent.store";

const AiAgentTabs = () => {
  const activeTab = useAiAgentStudioStore((state) => state.activeTab);
  const setActiveTab = useAiAgentStudioStore((state) => state.setActiveTab);

  return (
    <nav>
      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white p-1">
        {AI_AGENT_TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                "cursor-pointer shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default AiAgentTabs;
