import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { PREBUILT_SKILLS, SKILL_TYPE } from "../../constants/skill-catalog.constant";
import { useAiAgentStudioStore } from "../../store/ai-agent.store";
import { fieldLabel } from "../layout/StudioSection";
import { SkillIconTile } from "../skills/SkillGlyph";

const STEPS = ["Business", "Capabilities", "Rules"] as const;

const CAPABILITY_SUMMARY: Record<string, string> = {
  [SKILL_TYPE.HANDLE_SUPPORT]:
    "Answer questions about the business from the knowledge you add later.",
  [SKILL_TYPE.HUMAN_HANDOFF]:
    "Hand the conversation to a teammate when someone asks for a person.",
  [SKILL_TYPE.LEAD_QUALIFICATION]:
    "Collect a few details when a customer wants to buy or book a demo.",
  [SKILL_TYPE.APPOINTMENT_BOOKING]:
    "Help customers request a visit, demo, or callback.",
};

const CreateAgentScreen = () => {
  const creating = useAiAgentStudioStore((state) => state.creating);
  const createAgent = useAiAgentStudioStore((state) => state.createAgent);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [greeting, setGreeting] = useState("");
  const [skills, setSkills] = useState<string[]>([
    SKILL_TYPE.HANDLE_SUPPORT,
    SKILL_TYPE.HUMAN_HANDOFF,
  ]);
  const [rules, setRules] = useState("");

  const toggleSkill = (type: string) => {
    setSkills((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type],
    );
  };

  const finish = () => {
    if (!name.trim() || creating) return;
    const groundRules = rules
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    void createAgent({
      name: name.trim(),
      industry: industry.trim(),
      website: website.trim(),
      greeting: greeting.trim(),
      description: description.trim(),
      skillTypes: skills,
      groundRules,
    });
  };

  return (
    <div className="flex h-[calc(100vh-128px)] items-start justify-center overflow-y-auto bg-[#f3f1f2] px-4 py-8">
      <section className="w-full max-w-2xl rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-2">
          {STEPS.map((label, index) => (
            <div key={label} className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                  index <= step ? "bg-primary text-white" : "bg-slate-100 text-slate-400",
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "truncate text-xs font-medium",
                  index === step ? "text-slate-900" : "text-slate-400",
                )}
              >
                {label}
              </span>
              {index < STEPS.length - 1 ? (
                <span className={cn("h-px flex-1", index < step ? "bg-primary" : "bg-slate-200")} />
              ) : null}
            </div>
          ))}
        </div>

        {step === 0 ? (
          <div className="mt-6">
            <h1 className="text-sm font-semibold text-slate-900">Tell us about the business</h1>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              This is how the agent introduces itself. You can change it later.
            </p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <p className={fieldLabel}>Business name</p>
                <Input
                  className="input-field mt-1.5"
                  value={name}
                  placeholder="Hotel Sales Agent"
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div>
                <p className={fieldLabel}>Industry</p>
                <Input
                  className="input-field mt-1.5"
                  value={industry}
                  placeholder="Hotel, clinic, real estate..."
                  onChange={(event) => setIndustry(event.target.value)}
                />
              </div>
            </div>
            <div className="mt-5">
              <p className={fieldLabel}>Website</p>
              <Input
                className="input-field mt-1.5"
                value={website}
                placeholder="https://example.com"
                onChange={(event) => setWebsite(event.target.value)}
              />
            </div>
            <div className="mt-5">
              <p className={fieldLabel}>What does the business do?</p>
              <Textarea
                className="input-field mt-1.5 resize-none"
                rows={3}
                value={description}
                placeholder="A short description the agent can use when customers ask who you are."
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div className="mt-5">
              <p className={fieldLabel}>Greeting</p>
              <Input
                className="input-field mt-1.5"
                value={greeting}
                placeholder="Hi, thanks for messaging us..."
                onChange={(event) => setGreeting(event.target.value)}
              />
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="mt-6">
            <h1 className="text-sm font-semibold text-slate-900">What should this agent do?</h1>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Pick the jobs it should handle. You can add or turn these off later.
            </p>
            <div className="mt-4 space-y-2">
              {PREBUILT_SKILLS.map((skill) => {
                const selected = skills.includes(skill.type);
                return (
                  <button
                    key={skill.type}
                    type="button"
                    onClick={() => toggleSkill(skill.type)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 bg-white hover:border-slate-300",
                    )}
                  >
                    <SkillIconTile icon={skill.icon} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-slate-900">{skill.name}</span>
                      <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                        {CAPABILITY_SUMMARY[skill.type]}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "mt-1 size-4 shrink-0 rounded border",
                        selected ? "border-primary bg-primary" : "border-slate-300 bg-white",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="mt-6">
            <h1 className="text-sm font-semibold text-slate-900">Anything it should always follow?</h1>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Optional. Add one rule per line. You can skip this and edit rules later.
            </p>
            <p className={cn(fieldLabel, "mt-5")}>Ground rules</p>
            <Textarea
              className="input-field mt-1.5 resize-none"
              rows={5}
              value={rules}
              placeholder={"Never promise a discount that is not on the website.\nAlways mention check-in is at 2 PM."}
              onChange={(event) => setRules(event.target.value)}
            />
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            className="h-9 rounded-xl"
            disabled={step === 0 || creating}
            onClick={() => setStep((current) => Math.max(0, current - 1))}
          >
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              className="h-9 rounded-xl"
              disabled={step === 0 && !name.trim()}
              onClick={() => setStep((current) => current + 1)}
            >
              Continue
            </Button>
          ) : (
            <Button className="h-9 rounded-xl" disabled={creating || !name.trim()} onClick={finish}>
              {creating ? "Creating..." : "Create agent"}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default CreateAgentScreen;
