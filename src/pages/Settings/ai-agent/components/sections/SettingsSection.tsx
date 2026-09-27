import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAiAgentStudioStore } from "../../store/ai-agent.store";
import StudioSection, { fieldLabel } from "../layout/StudioSection";

const SettingsSection = () => {
  const config = useAiAgentStudioStore((state) => state.config);
  const versions = useAiAgentStudioStore((state) => state.versions);
  const live = useAiAgentStudioStore((state) => state.live);
  const patchConfig = useAiAgentStudioStore((state) => state.patchConfig);
  const rollback = useAiAgentStudioStore((state) => state.rollback);

  return (
    <div className="space-y-5">
      <StudioSection
        title="Safety & handoff"
        description="When the agent should stop and pass the chat to a teammate."
      >
        <div className="space-y-4">
          {(
            [
              ["neverInventFacts", "Never invent facts"],
              ["onHumanRequest", "Hand off when the customer asks for a human"],
              ["onUnknownInfo", "Hand off when information is missing"],
              ["onComplaint", "Hand off on complaints"],
              ["onLowConfidence", "Hand off on low confidence"],
            ] as const
          ).map(([key, title]) => (
            <div key={key} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 px-3.5 py-2.5">
              <p className="text-xs text-slate-700">{title}</p>
              <Switch
                checked={Boolean(config.safety[key])}
                onCheckedChange={(checked) =>
                  patchConfig({ safety: { ...config.safety, [key]: checked } })
                }
              />
            </div>
          ))}
        </div>
        <div className="mt-5">
          <p className={fieldLabel}>Low confidence threshold</p>
          <Input
            type="number"
            step="0.05"
            min="0"
            max="1"
            className="input-field mt-1.5 max-w-40"
            value={config.safety.lowConfidenceThreshold}
            onChange={(e) =>
              patchConfig({
                safety: {
                  ...config.safety,
                  lowConfidenceThreshold: Number(e.target.value) || 0,
                },
              })
            }
          />
        </div>
        <div className="mt-5">
          <p className={fieldLabel}>Customer handoff message</p>
          <Textarea
            className="input-field mt-1.5 resize-none"
            rows={3}
            value={config.safety.customerHandoffMessage}
            onChange={(e) =>
              patchConfig({
                safety: {
                  ...config.safety,
                  customerHandoffMessage: e.target.value,
                },
              })
            }
          />
        </div>
      </StudioSection>

      <StudioSection
        title="Versions"
        description="Restore a published version into the current draft. Live WhatsApp still uses the previous agent until you switch it."
      >
        {live?.version ? (
          <p className="mb-3 text-xs text-slate-500">Published version {live.version}</p>
        ) : (
          <p className="mb-3 text-xs text-slate-400">Not published yet.</p>
        )}
        <div className="space-y-2.5">
          {versions.map((version) => (
            <div
              key={version.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">Version {version.version}</p>
                <p className="mt-0.5 text-xs text-slate-400">{version.status}</p>
              </div>
              {version.status === "published" ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg text-xs"
                  onClick={() => void rollback(version.id)}
                >
                  Restore
                </Button>
              ) : null}
            </div>
          ))}
          {!versions.length ? (
            <p className="text-xs text-slate-400">No versions yet.</p>
          ) : null}
        </div>
      </StudioSection>
    </div>
  );
};

export default SettingsSection;
