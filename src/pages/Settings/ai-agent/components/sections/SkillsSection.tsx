import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { isBuiltInSkill } from "../../constants/skill-catalog.constant";
import { useAiAgentStudioStore } from "../../store/ai-agent.store";
import type {
  TAiAgentSkillCollectField,
  TAiAgentSkillConfig,
  TAiAgentToolConfig,
} from "../../types/ai-agent.type";
import CustomActionDialog from "../dialogs/CustomActionDialog";
import AddCapabilitiesDialog from "../dialogs/AddCapabilitiesDialog";
import StudioSection, { fieldLabel } from "../layout/StudioSection";
import SkillCollectFields from "../skills/SkillCollectFields";
import SkillConnectedTools from "../skills/SkillConnectedTools";
import { SkillIconTile } from "../skills/SkillGlyph";

const collectFieldsOf = (skill: TAiAgentSkillConfig): TAiAgentSkillCollectField[] =>
  Array.isArray(skill.config?.collectFields) ? skill.config.collectFields : [];

const connectedKeysOf = (skill: TAiAgentSkillConfig): string[] =>
  Array.isArray(skill.config?.connectedToolKeys) ? skill.config.connectedToolKeys : [];

const SkillsSection = () => {
  const config = useAiAgentStudioStore((state) => state.config);
  const patchConfig = useAiAgentStudioStore((state) => state.patchConfig);
  const saveDraft = useAiAgentStudioStore((state) => state.saveDraft);
  const saving = useAiAgentStudioStore((state) => state.saving);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [apiOpen, setApiOpen] = useState(false);
  const [apiSkillKey, setApiSkillKey] = useState<string | null>(null);

  const enabledCount = config.skills.filter((skill) => skill.enabled).length;

  const persist = (next: {
    skills?: TAiAgentSkillConfig[];
    tools?: TAiAgentToolConfig[];
  }) => {
    patchConfig(next);
    void saveDraft(next);
  };

  const persistSkills = (skills: TAiAgentSkillConfig[]) => persist({ skills });

  const updateSkill = (key: string, patch: Partial<TAiAgentSkillConfig>) => {
    persistSkills(
      config.skills.map((skill) => (skill.key === key ? { ...skill, ...patch } : skill)),
    );
  };

  const patchSkillLocal = (key: string, patch: Partial<TAiAgentSkillConfig>) => {
    patchConfig({
      skills: config.skills.map((skill) => (skill.key === key ? { ...skill, ...patch } : skill)),
    });
  };

  const addSkills = (incoming: TAiAgentSkillConfig[]) => {
    const next = [...config.skills];
    for (const skill of incoming) {
      const index = next.findIndex((item) => item.key === skill.key);
      if (index >= 0) next[index] = { ...next[index], ...skill, enabled: true };
      else next.push(skill);
    }
    persistSkills(next);
    const last = incoming[incoming.length - 1];
    if (last) setExpanded(last.key);
  };

  const connectTool = (skillKey: string, toolKey: string) => {
    persistSkills(
      config.skills.map((skill) => {
        if (skill.key !== skillKey) return skill;
        const keys = connectedKeysOf(skill);
        if (keys.includes(toolKey)) return skill;
        return {
          ...skill,
          config: { ...skill.config, connectedToolKeys: [...keys, toolKey] },
        };
      }),
    );
  };

  return (
    <StudioSection
      title="Skills"
      description="Jobs your agent can handle. Expand a skill to set when it runs and what to collect."
      action={
        <Button size="sm" className="h-8 rounded-xl text-xs" onClick={() => setOpen(true)}>
          <Plus className="size-3.5" />
          Add
        </Button>
      }
    >
      <p className="mb-4 text-xs text-slate-400">
        {enabledCount} of {config.skills.length} enabled
      </p>

      <div className="space-y-2.5">
        {config.skills.map((skill) => {
          const builtIn = isBuiltInSkill(skill);
          const isOpen = expanded === skill.key;
          return (
            <div
              key={skill.key}
              className={`overflow-hidden rounded-2xl border ${
                isOpen ? "border-primary/20 bg-primary/[0.03]" : "border-slate-200/80 bg-white"
              }`}
            >
              <div className="flex items-center gap-3 px-3.5 py-3">
                <button
                  type="button"
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                  onClick={() =>
                    setExpanded((prev) => (prev === skill.key ? null : skill.key))
                  }
                >
                  <SkillIconTile icon={skill.icon} size="sm" />
                  <span className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">{skill.name}</p>
                    <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-slate-500">
                      {skill.whenToUse || skill.instructions || "No description yet."}
                    </p>
                  </span>
                </button>
                <Checkbox
                  checked={skill.enabled}
                  onCheckedChange={(checked) =>
                    updateSkill(skill.key, { enabled: Boolean(checked) })
                  }
                  aria-label={`Enable ${skill.name}`}
                />
                <button
                  type="button"
                  aria-label={isOpen ? `Collapse ${skill.name}` : `Expand ${skill.name}`}
                  className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  onClick={() =>
                    setExpanded((prev) => (prev === skill.key ? null : skill.key))
                  }
                >
                  <ChevronDown
                    className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {isOpen ? (
                <div className="space-y-5 border-t border-slate-200 bg-white px-4 py-5">
                  <div>
                    <p className={fieldLabel}>
                      When it’s used
                      {builtIn ? (
                        <span className="ml-1.5 font-normal text-slate-400">managed by Kyra</span>
                      ) : null}
                    </p>
                    {builtIn ? (
                      <p className="mt-2 text-xs leading-5 text-slate-600">{skill.whenToUse}</p>
                    ) : (
                      <Textarea
                        className="input-field mt-2 resize-none text-xs"
                        rows={3}
                        value={skill.whenToUse || ""}
                        onChange={(e) =>
                          patchSkillLocal(skill.key, { whenToUse: e.target.value })
                        }
                      />
                    )}
                  </div>

                  {!builtIn ? (
                    <div>
                      <p className={fieldLabel}>Instructions</p>
                      <Textarea
                        className="input-field mt-2 resize-none text-xs"
                        rows={4}
                        value={skill.instructions}
                        onChange={(e) =>
                          patchSkillLocal(skill.key, { instructions: e.target.value })
                        }
                      />
                    </div>
                  ) : null}

                  <SkillCollectFields
                    fields={collectFieldsOf(skill)}
                    onChange={(collectFields) =>
                      persistSkills(
                        config.skills.map((item) =>
                          item.key === skill.key
                            ? { ...item, config: { ...item.config, collectFields } }
                            : item,
                        ),
                      )
                    }
                  />

                  <SkillConnectedTools
                    tools={config.tools}
                    connectedKeys={connectedKeysOf(skill)}
                    onConnect={(toolKey) => connectTool(skill.key, toolKey)}
                    onDisconnect={(toolKey) =>
                      persistSkills(
                        config.skills.map((item) =>
                          item.key === skill.key
                            ? {
                                ...item,
                                config: {
                                  ...item.config,
                                  connectedToolKeys: connectedKeysOf(item).filter(
                                    (key) => key !== toolKey,
                                  ),
                                },
                              }
                            : item,
                        ),
                      )
                    }
                    onDefineNew={() => {
                      setApiSkillKey(skill.key);
                      setApiOpen(true);
                    }}
                  />

                  <div className="flex items-center justify-between gap-3 pt-1">
                    {builtIn ? (
                      <span />
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-lg text-xs text-red-600"
                        onClick={() => {
                          persistSkills(config.skills.filter((item) => item.key !== skill.key));
                          setExpanded(null);
                        }}
                      >
                        <Trash2 className="size-3.5" />
                        Remove
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="h-8 rounded-lg text-xs"
                      disabled={saving}
                      onClick={() => void saveDraft({ skills: config.skills })}
                    >
                      {saving ? "Saving..." : "Save skill"}
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
        {!config.skills.length ? (
          <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-xs text-slate-400">
            No skills yet. Add a pre-built capability or create a custom one.
          </p>
        ) : null}
      </div>

      <AddCapabilitiesDialog
        open={open}
        existing={config.skills}
        onOpenChange={setOpen}
        onAdd={addSkills}
      />
      <CustomActionDialog
        open={apiOpen}
        onOpenChange={setApiOpen}
        onSave={(tool) => {
          const tools = config.tools.some((item) => item.key === tool.key)
            ? config.tools.map((item) => (item.key === tool.key ? tool : item))
            : [...config.tools, tool];
          const skills = apiSkillKey
            ? config.skills.map((skill) => {
                if (skill.key !== apiSkillKey) return skill;
                const keys = connectedKeysOf(skill);
                return {
                  ...skill,
                  config: {
                    ...skill.config,
                    connectedToolKeys: keys.includes(tool.key) ? keys : [...keys, tool.key],
                  },
                };
              })
            : config.skills;
          persist({ tools, skills });
          setApiSkillKey(null);
        }}
      />
    </StudioSection>
  );
};

export default SkillsSection;
