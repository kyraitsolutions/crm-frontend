import { useEffect } from "react";
import { FeatureGate } from "@/components/subscription/FeatureGate";
import { FEATURE } from "@/constants/subscription.constant";
import DataLoader from "@/components/Loader/data-loader";
import { useAuthStore } from "@/stores";
import AiAgentHeader from "./components/header/AiAgentHeader";
import AiAgentContent from "./components/tabs/AiAgentContent";
import AiAgentTabs from "./components/tabs/AiAgentTabs";
import CreateAgentScreen from "./components/create/CreateAgentScreen";
import TrainPanel from "./components/train/TrainPanel";
import { useAiAgentStudioStore } from "./store/ai-agent.store";

const DraftBanner = () => {
  const live = useAiAgentStudioStore((state) => state.live);
  const draft = useAiAgentStudioStore((state) => state.draft);
  if (!live || !draft) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl border border-amber-200/70 bg-amber-50 px-3 py-0.5 text-[11px] text-amber-900">
      <span className="size-1.5 shrink-0 rounded-full bg-amber-500" />
      Draft changes are not live yet. Customers still see the last published version.
    </div>
  );
};

const AiAgentPage = () => {
  const { accountId } = useAuthStore();
  const loading = useAiAgentStudioStore((state) => state.loading);
  const agent = useAiAgentStudioStore((state) => state.agent);
  const load = useAiAgentStudioStore((state) => state.load);

  useEffect(() => {
    if (!accountId) return;
    void load(String(accountId));
  }, [accountId, load]);

  return (
    <FeatureGate feature={FEATURE.WHATSAPP_AI_AGENT}>
      {loading ? (
        <DataLoader className="h-[calc(100vh-180px)]" />
      ) : !agent ? (
        <CreateAgentScreen />
      ) : (
        <div className="flex h-[calc(100vh-128px)] flex-col overflow-hidden bg-[#f3f1f2]">
          <AiAgentHeader />
          <DraftBanner />
          <div className="flex min-h-0 flex-1 gap-3 px-2 pb-3 mt-2">
            <div className="hide-scrollbar min-w-0 flex-1 overflow-y-auto space-y-2">
              <AiAgentTabs />
              <AiAgentContent />
            </div>
            <TrainPanel />
          </div>
        </div>
      )}
    </FeatureGate>
  );
};

export default AiAgentPage;
