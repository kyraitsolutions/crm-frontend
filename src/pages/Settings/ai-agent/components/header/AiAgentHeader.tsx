import { Button } from "@/components/ui/button";
import { Rocket, Save } from "lucide-react";
import { useAiAgentStudioStore } from "../../store/ai-agent.store";

const AiAgentHeader = () => {
  const agent = useAiAgentStudioStore((state) => state.agent);
  const live = useAiAgentStudioStore((state) => state.live);
  const config = useAiAgentStudioStore((state) => state.config);
  const saving = useAiAgentStudioStore((state) => state.saving);
  const publishing = useAiAgentStudioStore((state) => state.publishing);
  const saveDraft = useAiAgentStudioStore((state) => state.saveDraft);
  const publish = useAiAgentStudioStore((state) => state.publish);

  const name = config.identity.name || agent?.name || "Chat agent";

  return (
    <div className="border-b border-slate-200/80 bg-white px-5 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
            Agent studio
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <h1 className="truncate text-base font-semibold tracking-tight text-slate-950">
              {name}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                live ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"
              }`}
            >
              <span className={`size-1.5 rounded-full ${live ? "bg-primary" : "bg-slate-400"}`} />
              {live ? "Live" : "Draft"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-2xl border-slate-200 px-3.5 text-xs text-slate-700"
            onClick={() => document.getElementById("ai-agent-train-input")?.focus()}
          >
            Test
          </Button> */}
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-2xl border-slate-200 px-3.5 text-xs text-slate-700"
            disabled={saving || publishing}
            onClick={() => void saveDraft()}
          >
            <Save className="size-3.5" />
            {saving ? "Saving..." : "Save draft"}
          </Button>
          <Button
            size="sm"
            className="h-9 rounded-2xl px-4 text-xs shadow-sm"
            disabled={saving || publishing}
            onClick={() => void publish()}
          >
            <Rocket className="size-3.5" />
            {publishing ? "Publishing..." : "Go live"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiAgentHeader;
