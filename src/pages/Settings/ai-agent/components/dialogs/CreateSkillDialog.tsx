import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToastMessageService } from "@/services";
import { Sparkles } from "lucide-react";
import { CUSTOM_SKILL_SUGGESTIONS, SKILL_TYPE } from "../../constants/skill-catalog.constant";
import { aiAgentStudioService } from "../../services/ai-agent.service";
import { useAiAgentStudioStore } from "../../store/ai-agent.store";
import type { TAiAgentSkillConfig, TAiSkillSuggestion } from "../../types/ai-agent.type";
import { slugKey } from "../../utils/action.utils";
import { SKILL_ICON_OPTIONS, SkillGlyph, SkillIconTile } from "../skills/SkillGlyph";

const toast = new ToastMessageService();

const CreateSkillDialog = ({
  open,
  existing,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  existing: TAiAgentSkillConfig[];
  onOpenChange: (open: boolean) => void;
  onAdd: (skill: TAiAgentSkillConfig) => void;
}) => {
  const accountId = useAiAgentStudioStore((state) => state.accountId);
  const [suggestionId, setSuggestionId] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("package");
  const [whenToUse, setWhenToUse] = useState("");
  const [instructions, setInstructions] = useState("");
  const [drafting, setDrafting] = useState(false);

  const reset = () => {
    setSuggestionId("");
    setDescription("");
    setName("");
    setIcon("package");
    setWhenToUse("");
    setInstructions("");
    setDrafting(false);
  };

  const applySuggestion = (item: TAiSkillSuggestion) => {
    setSuggestionId(item.id);
    setName(item.name);
    setIcon(item.icon);
    setWhenToUse(item.whenToUse);
    setInstructions(item.instructions);
    if (!description.trim()) {
      setDescription(item.whenToUse);
    }
  };

  const isDistinct = useMemo(() => {
    const needle = whenToUse.trim().toLowerCase().slice(0, 48);
    if (needle.length < 12) return false;
    return !existing.some(
      (skill) => skill.whenToUse.trim().toLowerCase().slice(0, 48) === needle,
    );
  }, [existing, whenToUse]);

  const draftWithAi = async () => {
    if (!description.trim() && !suggestionId) {
      toast.error("Describe what this skill should do, or pick a suggestion");
      return;
    }
    setDrafting(true);
    try {
      const suggestion = CUSTOM_SKILL_SUGGESTIONS.find((item) => item.id === suggestionId);
      const response = await aiAgentStudioService.draftSkill(accountId, {
        description: description.trim(),
        suggestion: suggestion?.name || suggestionId,
      });
      const draft = response.data?.doc;
      if (!draft) throw new Error("Could not draft skill");
      setName(draft.name || name);
      setWhenToUse(draft.whenToUse || whenToUse);
      setInstructions(draft.instructions || instructions);
      setIcon(draft.icon || icon);
      toast.success("Skill draft ready — review it before adding");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not draft skill";
      toast.error(message);
    } finally {
      setDrafting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-[18px]" />
            </div>
            <div>
              <DialogTitle className="text-xl">Create skill</DialogTitle>
              <DialogDescription>Teach your agent a new job, in plain language.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-slate-800">
              Start from a suggestion{" "}
              <span className="font-normal text-slate-400">tap to prefill</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {CUSTOM_SKILL_SUGGESTIONS.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  variant={suggestionId === item.id ? "default" : "outline"}
                  className="h-auto rounded-full px-3 py-1.5 text-xs"
                  onClick={() => applySuggestion(item)}
                >
                  <SkillGlyph icon={item.icon} className="size-3.5" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-800">Or describe what this skill should do</p>
            <Textarea
              className="input-field mt-2 min-h-[88px] resize-none"
              placeholder="e.g. handle product return requests and check eligibility"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-xl border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
            disabled={drafting}
            onClick={() => void draftWithAi()}
          >
            <Sparkles className="size-4" />
            {drafting ? "Drafting..." : "Draft with AI"}
          </Button>

          <div>
            <p className="text-sm font-medium text-slate-800">Icon & name</p>
            <div className="mt-2 flex items-center gap-3">
              <SkillIconTile icon={icon} />
              <Input
                className="input-field"
                placeholder="Bulk & wholesale orders"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {SKILL_ICON_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`flex size-9 items-center justify-center rounded-lg border ${
                    icon === item
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                  onClick={() => setIcon(item)}
                  aria-label={item}
                >
                  <SkillGlyph icon={item} className="size-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-800">When should the agent use it?</p>
            <Textarea
              className="input-field mt-2 min-h-[72px] resize-none"
              placeholder="Customer asks about ordering in bulk or business pricing."
              value={whenToUse}
              onChange={(e) => setWhenToUse(e.target.value)}
            />
            {isDistinct ? (
              <p className="mt-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-[#21733F]">
                Distinct ✓
              </p>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-800">Instructions</p>
            <Textarea
              className="input-field mt-2 min-h-[88px] resize-none"
              placeholder="Collect company name and quantity, then share the wholesale rate card and create a lead."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="rounded-xl"
            onClick={() => {
              if (!name.trim()) {
                toast.error("Skill name is required");
                return;
              }
              if (!whenToUse.trim()) {
                toast.error("Explain when the agent should use this skill");
                return;
              }
              const key = `custom_${slugKey(name) || Date.now()}`;
              onAdd({
                key: existing.some((skill) => skill.key === key)
                  ? `${key}_${Date.now()}`
                  : key,
                type: SKILL_TYPE.CUSTOM,
                enabled: true,
                name: name.trim(),
                icon,
                whenToUse: whenToUse.trim(),
                instructions: instructions.trim(),
                config: { collectFields: [], connectedToolKeys: [] },
              });
              toast.success("Custom skill added");
              onOpenChange(false);
            }}
          >
            + Add skill
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSkillDialog;
