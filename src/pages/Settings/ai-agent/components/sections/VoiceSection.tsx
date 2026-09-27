import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  RESPONSE_LENGTH_OPTIONS,
  VOICE_PRESET_OPTIONS,
} from "../../constants/ai-agent.constant";
import { useAiAgentStudioStore } from "../../store/ai-agent.store";
import StudioSection, { fieldLabel } from "../layout/StudioSection";

const VoiceSection = () => {
  const config = useAiAgentStudioStore((state) => state.config);
  const patchConfig = useAiAgentStudioStore((state) => state.patchConfig);

  return (
    <div className="space-y-5">
      <StudioSection
        title="Voice"
        description="Tone and length for WhatsApp-style replies."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <p className={fieldLabel}>Preset</p>
            <Select
              value={config.voice.preset}
              onValueChange={(preset) =>
                patchConfig({ voice: { ...config.voice, preset } })
              }
            >
              <SelectTrigger className="input-field mt-1.5 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {VOICE_PRESET_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className={fieldLabel}>Response length</p>
            <Select
              value={config.voice.responseLength}
              onValueChange={(responseLength) =>
                patchConfig({ voice: { ...config.voice, responseLength } })
              }
            >
              <SelectTrigger className="input-field mt-1.5 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {RESPONSE_LENGTH_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className={fieldLabel}>Language</p>
            <Input
              className="input-field mt-1.5"
              value={config.voice.language}
              onChange={(e) =>
                patchConfig({ voice: { ...config.voice, language: e.target.value } })
              }
            />
          </div>
        </div>
        <div className="mt-5">
          <p className={fieldLabel}>Custom instructions</p>
          <Textarea
            className="input-field mt-1.5 resize-none"
            rows={4}
            value={config.voice.customInstructions}
            onChange={(e) =>
              patchConfig({
                voice: { ...config.voice, customInstructions: e.target.value },
              })
            }
          />
        </div>
        <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 px-4 py-3">
          <div>
            <p className={fieldLabel}>WhatsApp buttons and lists</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              On, the agent can send buttons, lists, and links. Off, every reply is text only.
            </p>
          </div>
          <Switch
            checked={config.voice.interactiveReplies !== false}
            onCheckedChange={(checked) =>
              patchConfig({
                voice: { ...config.voice, interactiveReplies: checked },
              })
            }
          />
        </div>
      </StudioSection>

      <StudioSection
        title="Ground rules"
        description="Facts the agent must never invent."
        action={
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-xs"
            onClick={() => patchConfig({ groundRules: [...config.groundRules, ""] })}
          >
            <Plus className="size-3.5" />
            Add
          </Button>
        }
      >
        <div className="space-y-2.5">
          {config.groundRules.map((rule, index) => (
            <div key={index} className="flex items-start gap-2">
              <Textarea
                className="input-field min-h-16 resize-y"
                rows={2}
                value={rule}
                onChange={(e) => {
                  const next = [...config.groundRules];
                  next[index] = e.target.value;
                  patchConfig({ groundRules: next });
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="mt-1 rounded-lg"
                onClick={() =>
                  patchConfig({
                    groundRules: config.groundRules.filter((_, i) => i !== index),
                  })
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </StudioSection>

      <StudioSection title="Safety & handoff">
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
            <div key={key} className="flex items-center justify-between gap-4">
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
    </div>
  );
};

export default VoiceSection;
