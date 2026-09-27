import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { SKILL_CONTACT_ATTRIBUTES } from "../../constants/skill-catalog.constant";
import type { TAiAgentSkillCollectField } from "../../types/ai-agent.type";
import { fieldHint, fieldLabel } from "../layout/StudioSection";

const emptyField = (): TAiAgentSkillCollectField => ({
  question: "",
  attribute: "",
  required: false,
});

const SkillCollectFields = ({
  fields,
  onChange,
}: {
  fields: TAiAgentSkillCollectField[];
  onChange: (fields: TAiAgentSkillCollectField[]) => void;
}) => {
  const [draft, setDraft] = useState<TAiAgentSkillCollectField>(emptyField());

  const addVariable = () => {
    if (!draft.question.trim() || !draft.attribute.trim()) return;
    onChange([...fields, { ...draft, question: draft.question.trim() }]);
    setDraft(emptyField());
  };

  return (
    <div className="space-y-3">
      <div>
        <p className={fieldLabel}>Questions to collect</p>
        <p className={`mt-1 ${fieldHint}`}>
          The agent asks each question and saves the answer to a contact attribute.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <Input
          className="input-field"
          placeholder="Question to ask (e.g. What’s your monthly budget?)"
          value={draft.question}
          onChange={(e) => setDraft((prev) => ({ ...prev, question: e.target.value }))}
        />
        <Select
          value={draft.attribute || undefined}
          onValueChange={(attribute) => setDraft((prev) => ({ ...prev, attribute }))}
        >
          <SelectTrigger className="input-field w-full">
            <SelectValue placeholder="Select An Attribute..." />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {SKILL_CONTACT_ATTRIBUTES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <Checkbox
            checked={draft.required}
            onCheckedChange={(checked) =>
              setDraft((prev) => ({ ...prev, required: Boolean(checked) }))
            }
          />
          Required
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 rounded-lg text-xs"
          disabled={!draft.question.trim() || !draft.attribute.trim()}
          onClick={addVariable}
        >
          + Add variable
        </Button>
      </div>

      {fields.length ? (
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={`${field.attribute}-${index}`}
              className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-xs text-slate-800">{field.question}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {SKILL_CONTACT_ATTRIBUTES.find((item) => item.value === field.attribute)
                    ?.label || field.attribute}
                  {field.required ? " · required" : ""}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-lg text-slate-400 hover:text-red-500"
                onClick={() => onChange(fields.filter((_, i) => i !== index))}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default SkillCollectFields;
